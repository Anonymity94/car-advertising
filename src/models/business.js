import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { pageModel, doPageRequest } from '@/utils/model';
import {
  queryBusinesses,
  queryBusinessContent,
  queryAllBusinessGoods,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from '@/services/business';

export default modelExtend(pageModel, {
  namespace: 'businessModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/integral/businesses') {
          const payload = { ...location.query };
          dispatch({
            type: 'queryBusinesses',
            payload,
          });
        }
      });
    },
  },

  state: {
    businesses: [], // 活动列表
    detail: {},
    allGoods: []
  },

  effects: {
    /**
     * 获取商户列表
     */
    *queryBusinesses({ payload = {} }, { call, put }) {
      yield doPageRequest({ api: queryBusinesses, payload, call, put, stateKey: 'businesses' });
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
    *deleteBusiness({ payload }, { call }) {
      const { success } = yield call(deleteBusiness, payload);
      if (success) {
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
      return success;
    },
  },
});
