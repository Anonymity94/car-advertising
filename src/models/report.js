import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import { countRegisterMetrics, countTodos, countSigningMetrics } from '@/services/report';

export default modelExtend(model, {
  namespace: 'reportModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/workplace') {
          dispatch({
            type: 'countRegisterMetrics',
          });
          dispatch({
            type: 'countSigningMetrics',
          });
          dispatch({
            type: 'countTodos',
          });
        }
      });
    },
  },

  state: {
    registerMetrics: [], // 车主注册
    signingMetrics: [], // 广告签约
    todoMetrics: [], // 待处理事项
  },

  effects: {
    /**
     * 一段时间内，每天的用户注册数量
     */
    *countRegisterMetrics({ payload = {} }, { call, put }) {
      const { success, result } = yield call(countRegisterMetrics, payload);
      yield put({
        type: 'updateState',
        payload: {
          registerMetrics: success ? result : [],
        },
      });
    },

    /**
     * 一段时间内的，每天的广告签约数量
     */
    *countSigningMetrics({ payload = {} }, { call, put }) {
      const { success, result } = yield call(countSigningMetrics, payload);
      yield put({
        type: 'updateState',
        payload: {
          signingMetrics: success ? result : [],
        },
      });
    },

    /**
     * 统计不同模块下的待处理事项
     */
    *countTodos({ payload = {} }, { call, put }) {
      const { success, result } = yield call(countTodos, payload);
      yield put({
        type: 'updateState',
        payload: {
          todoMetrics: success ? result : [],
        },
      });
    },
  },
});
