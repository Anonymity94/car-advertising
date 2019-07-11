import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import { queryAppeals, updateAppealState, createAppeal } from '@/services/appeal';
import router from 'umi/router';

export default modelExtend(model, {
  namespace: 'appealModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/application/appeals') {
          dispatch({
            type: 'queryAppeals',
          });
        }
      });
    },
  },

  state: {
    list: [], // 申诉列表
  },

  effects: {
    /**
     * 获取所有申诉列表
     */
    *queryAppeals({ payload = {} }, { call, put }) {
      const { success, result } = yield call(queryAppeals, payload);
      yield put({
        type: 'updateState',
        payload: {
          list: success ? result : [],
        },
      });
    },

    /**
     * 用户提起申诉
     */
    *createAppeal({ payload }, { call, put }) {
      const { success } = yield call(createAppeal, payload);
      if (success) {
        router.push('/h5/user/waiting');
      } else {
        message.error('申诉成功失败');
      }
      return success;
    },

    /**
     * 申诉审核
     */
    *updateAppealState({ payload }, { call, put }) {
      const { success } = yield call(updateAppealState, payload);
      if (success) {
        message.success('审核成功');
        yield put({
          type: 'queryAppeals',
        });
      } else {
        message.error('审核失败');
      }
      return success;
    },
  },
});
