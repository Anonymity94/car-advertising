import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { pageModel, doPageRequest } from '@/utils/model';
import {
  queryDrivers,
  queryDriverById,
  queryAppeals,
  updateDriverState,
  updateAppealState,
} from '@/services/driver';

export default modelExtend(pageModel, {
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
        if (location.pathname === '/application/appeals') {
          const payload = { ...location.query };
          dispatch({
            type: 'queryAppeals',
            payload,
          });
        }
      });
    },
  },

  state: {
    drivers: [],
    appeals: [],
    detail: {},
  },

  effects: {
    // 所有车主列表
    *queryDrivers({ payload = {} }, { call, put }) {
      yield doPageRequest({ api: queryDrivers, payload, call, put, stateKey: 'drivers' });
    },
    // 车主详情
    *queryDriverDetail({ payload }, { call, put }) {
      const { success, result } = yield call(queryDriverById, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },
    // 获取所有申诉列表
    *queryAppeals({ payload = {} }, { call, put }) {
      yield doPageRequest({ api: queryAppeals, payload, call, put, stateKey: 'appeals' });
    },
    // 人员审核
    *updateDriverState({ payload }, { call }) {
      const { success } = yield call(updateDriverState, payload);
      if (success) {
        message.success('审核成功');
      } else {
        message.error('审核失败');
      }
      return success;
    },
    // 申诉审核
    *updateAppealState({ payload }, { call }) {
      const { success } = yield call(updateAppealState, payload);
      if (success) {
        message.success('审核成功');
      } else {
        message.error('审核失败');
      }
      return success;
    },
  },
});
