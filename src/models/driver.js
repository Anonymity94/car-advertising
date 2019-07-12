import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import router from 'umi/router';
import { Toast } from 'antd-mobile';
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
} from '@/services/driver';
import { AUDIT_STATE_PASSED } from '@/common/constants';

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
      const { success, result } = yield call(queryDriverById, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
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
      const { success } = yield call(getCaptcha, payload);
      if (success) {
        message.success('验证码获取成功');
      } else {
        message.error('验证码获取失败');
      }
      return success;
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
    *bindPhone({ payload }, { call }) {
      const { success } = yield call(bindPhone, payload);
      if (success) {
        router.push('/h5/user/center');
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

      const adSignings = success ? result : [];
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
      const adSettlements = success ? result : [];
      yield put({
        type: 'updateState',
        payload: {
          adSettlements,
        },
      });

      return {
        success,
        adSettlements,
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
