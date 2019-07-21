import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import router from 'umi/router';
import _ from 'lodash';
import { Toast, Modal } from 'antd-mobile';
import {
  queryDrivers,
  queryDriverById,
  auditDriver,
  updateDriver,
  deleteDriver,
  register,
  bindPhone,
  changePhone,
  getCaptcha,
  queryUserSignings,
  queryUserSettlements,
  queryUserExchanges,
  updateIntegral,
} from '@/services/driver';
import { AUDIT_STATE_PASSED, AUDIT_STATE_UNREVIEWED, AUDIT_STATE_REFUSE, SIGNING_GOLD_SETTLEMENT_STATE_UN_SETTLED } from '@/common/constants';

export default modelExtend(model, {
  namespace: 'driverModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/application/drivers') {
          const payload = { ...location.query };
          dispatch({
            type: 'queryDrivers',
            payload,
          });
        }
        if (location.pathname === '/user/drivers') {
          const payload = { ...location.query };
          dispatch({
            type: 'queryDrivers',
            payload: {
              ...payload,
              status: AUDIT_STATE_PASSED,
            },
          });
        }
      });
    },
  },

  state: {
    list: [],
    detail: {}, // 车主详情

    adSignings: [], // 我的签约记录
    adSettlements: [], // 我的结算记录
    integralExchanges: [], // 我的兑换记录
  },

  effects: {
    /**
     * 获取所有的车主列表
     */
    *queryDrivers({ payload = {} }, { call, put }) {
      const { success, result } = yield call(queryDrivers, payload);

      // 过滤出已审核通过的人员
      let list = success ? result : [];
      if (payload.status) {
        list = list.filter(item => item.status === payload.status);
      }

      // 列表中信息未审核状态的信息在最上，未审核状态以提交时间的顺序进行排序；
      // 其他两种状态在未审核状态的信息下面以审核时间的倒序进行展示；
      let unFinishList = [];
      let otherList = []
      list.forEach(item => {
        if(item.status === AUDIT_STATE_UNREVIEWED){
          unFinishList.push(item);
        } else {
          otherList.push(item)
        }
      })

      unFinishList = _.sortBy(unFinishList, [o => +new Date(o.createTime)]);
      otherList = _.sortBy(otherList, [o => -+new Date(o.verifyTime)]);
      list = [...unFinishList, ...otherList];

      yield put({
        type: 'updateState',
        payload: {
          list,
        },
      });
    },

    *queryApprovedDrivers({ payload }, { put }) {
      yield put({
        type: 'queryDrivers',
        payload: {
          ...payload,
          status: AUDIT_STATE_PASSED,
        },
      });
    },

    /**
     * 车主详情
     */
    *queryDriverDetail({ payload }, { call, put }) {
      const { from } = payload;
      const { success, result } = yield call(queryDriverById, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });

      // 如果来自微信，如果用户等待审核
      if (success && from === 'queryWechatUser') {
        if (result.status === AUDIT_STATE_UNREVIEWED) {
          router.replace('/h5/user/waiting');
        }
        if (result.status === AUDIT_STATE_REFUSE) {
          router.replace(`/h5/user/waiting?type=error&msg=${result.bandReason}`);
        }
      }
      return success ? result : {};
    },

    /**
     * 审核
     */
    *auditDriver({ payload }, { call }) {
      const { success } = yield call(auditDriver, payload);
      if (success) {
        message.success('审核成功');
      } else {
        message.error('审核失败');
      }
      return success;
    },

    /**
     * 修改人员
     */
    *updateDriver({ payload }, { call, put }) {
      const { id } = payload;
      const { success } = yield call(updateDriver, payload);
      if (window.location.href.indexOf('/h5/') === -1) {
        if (success) {
          message.success('更新成功');
          yield put({
            type: 'queryDriverDetail',
            payload: {
              id,
            },
          });
        } else {
          message.error('更新失败');
        }
      }
      return success;
    },

    /**
     * 更新用户的积分
     */
    *updateDriverIntegral({ payload }, { call, put }) {
      const { success } = yield call(updateIntegral, payload);
      // 如果页面是在微信端，再查一遍用户信息
      if (window.location.pathname.indexOf('/h5/') > -1) {
        yield put({
          type: 'queryDriverDetail',
          payload: {
            id: payload.id,
          },
        });
      }
      return success;
    },

    /**
     * 删除
     */
    *deleteDriver({ payload }, { call, put }) {
      const { success } = yield call(deleteDriver, payload);
      if (success) {
        message.success('删除成功');
        yield put({
          type: 'queryApprovedDrivers',
        });
      } else {
        message.error('删除失败');
      }
      return success;
    },

    // =========微信========

    /**
     * 获取验证码
     */
    *getCaptcha({ payload }, { call }) {
      const { success, result } = yield call(getCaptcha, payload);
      if (success) {
        message.success('验证码获取成功');
      } else {
        message.error('验证码获取失败');
      }
      return {
        success,
        captcha: success ? String(result) : '',
      };
    },

    /**
     * 用户注册
     */
    *register({ payload }, { call }) {
      Toast.loading('保存中....', 0);
      const { success } = yield call(register, payload);
      if (success) {
        // 跳转到成功提示
        router.push('/h5/user/waiting');
      } else {
        message.error('注册失败');
      }
      Toast.hide();
      return success;
    },

    /**
     * 微信端绑定手机号
     */
    *bindPhone({ payload }, { call, put }) {
      const { success, result } = yield call(bindPhone, payload);
      if (success) {
        const { code } = result;
        if (code === 200) {
          yield put({
            type: 'login/queryWechatUser',
          });
          router.push('/h5/user/center');
        } else if (code === 404) {
          // 这个号没有注册过，提示一下，是否去注册
          Modal.alert('帐号没有注册', '现在去注册吗？', [
            { text: '取消', onPress: () => {}, style: 'default' },
            {
              text: '注册',
              onPress: () => {
                router.push('/h5/user/register');
              },
            },
          ]);
        } else if (code === 403) {
          // 这个号没有审核通过
          Modal.alert('帐号审核中，请等待...', '', [
            { text: '好的', onPress: () => {}, style: 'default' },
          ]);
        }
      } else {
        message.error('绑定失败');
      }
      return success;
    },

    /**
     * 微信端更换手机号
     */
    *changePhone({ payload }, { call }) {
      const { success } = yield call(changePhone, payload);
      if (success) {
        message.success('更换手机号成功');
        // TODO
      } else {
        message.error('更换手机号失败');
      }
      return success;
    },

    /**
     * 微信端：我的签约记录
     */
    *queryUserSignings({ payload }, { call, put }) {
      const { success, result } = yield call(queryUserSignings, payload);

      let adSignings = success ? result : [];

      // 排序按照签约时间倒序
      adSignings = _.sortBy(adSignings, [o => -+new Date(o.createTime)]);

      yield put({
        type: 'updateState',
        payload: {
          adSignings,
        },
      });

      return {
        success,
        adSignings,
      };
    },

    /**
     * 微信端：我的结算记录
     */
    *queryUserSettlements({ payload }, { call, put }) {
      const { success, result } = yield call(queryUserSettlements, payload);
      let list = success ? result : [];
      // 排序按照结算时间倒序
      let unFinishList = [];
      let otherList = [];
      list.forEach(item => {
        if (item.settlementState === SIGNING_GOLD_SETTLEMENT_STATE_UN_SETTLED) {
          unFinishList.push(item);
        } else {
          otherList.push(item);
        }
      });

      unFinishList = _.sortBy(unFinishList, [o => +new Date(o.pasteTime)]);
      otherList = _.sortBy(otherList, [o => -+new Date(o.settlementTime)]);
      list = [...unFinishList, ...otherList];

      yield put({
        type: 'updateState',
        payload: {
          adSettlements: list,
        },
      });

      return {
        success,
        adSettlements: list,
      };
    },

    /**
     * 微信端：我的积分兑换记录
     */
    *queryUserExchanges({ payload }, { call, put }) {
      const { success, result } = yield call(queryUserExchanges, payload);
      const integralExchanges = success ? result : [];
      yield put({
        type: 'updateState',
        payload: {
          integralExchanges,
        },
      });

      return {
        success,
        integralExchanges,
      };
    },
  },
});
