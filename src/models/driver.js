import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { pageModel, doPageRequest } from '@/utils/model';
import { queryDrivers, queryDriverById, updateDriverState } from '@/services/driver';

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
      });
    },
  },

  state: {
    drivers: [],
    detail: {},
  },

  effects: {
    *queryDrivers({ payload = {} }, { call, put }) {
      yield doPageRequest({ api: queryDrivers, payload, call, put, stateKey: 'drivers' });
    },
    *queryDriverDetail({ payload }, { call, put }) {
      const { success, result } = yield call(queryDriverById, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },
    *updateDriverState({ payload }, { call }) {
      const { success } = yield call(updateDriverState, payload);
      if (success) {
        message.success('审核成功');
      } else {
        message.error('审核失败');
      }
      return success;
    },
  },
});
