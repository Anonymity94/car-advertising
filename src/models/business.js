import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import {
  queryBusinesses,
  queryBusinessContent,
  queryAllBusinessGoods,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  startIntegralSettlement
} from '@/services/business';

export default modelExtend(model, {
  namespace: 'businessModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/integral/businesses') {
          dispatch({
            type: 'queryBusinesses',
          });
        }
      });
    },
  },

  state: {
    list: [], // 活动列表
    detail: {},
    allGoods: [],
  },

  effects: {
    /**
     * 获取商户列表
     */
    *queryBusinesses({ payload = {} }, { call, put }) {
      const { success, result } = yield call(queryBusinesses, payload);
      yield put({
        type: 'updateState',
        payload: {
          list: success ? result : [],
        },
      });
    },

    /**
     * 商户详情
     */
    *queryBusinessContent({ payload }, { call, put }) {
      const { success, result } = yield call(queryBusinessContent, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },

    /**
     * 获取所有商户下的所有商品
     */
    *queryAllBusinessGoods({ payload }, { call, put }) {
      const { success, result } = yield call(queryAllBusinessGoods, payload);
      yield put({
        type: 'updateState',
        payload: {
          allGoods: success ? result : [],
        },
      });
    },

    /**
     * 新建商户
     */
    *createBusiness({ payload }, { call }) {
      const { success } = yield call(createBusiness, payload);
      if (success) {
        message.success('商户创建成功');
      } else {
        message.error('商户创建失败');
      }
      return success;
    },

    /**
     * 修改商户
     */
    *updateBusiness({ payload }, { call }) {
      const { success } = yield call(updateBusiness, payload);
      if (success) {
        message.success('商户修改成功');
      } else {
        message.error('商户修改失败');
      }
      return success;
    },

    /**
     * 删除商户
     */
    *deleteBusiness({ payload }, { call, put }) {
      const { success } = yield call(deleteBusiness, payload);
      if (success) {
        message.success('删除成功');
        yield put({
          type: 'queryBusinesses',
        });
      } else {
        message.error('删除失败');
      }
      return success;
    },

    /**
     * 某个商户根据兑换码给用户兑换商品
     */
    *startIntegralSettlement({ payload }, { call }) {
      const { success } = yield call(startIntegralSettlement, payload);
      if (success) {
        message.success('提现申请成功');
      } else {
        message.error('提现申请失败');
      }
      return success;
    },
  },
});
