import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { pageModel, doPageRequest } from '@/utils/model';
import { queryAppeals, updateAppealState } from '@/services/appeal';

export default modelExtend(pageModel, {
  namespace: 'appealModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
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
    appeals: [], // 申诉列表
  },

  effects: {
    /**
     * 获取所有申诉列表
     */
    *queryAppeals({ payload = {} }, { call, put }) {
      yield doPageRequest({ api: queryAppeals, payload, call, put, stateKey: 'appeals' });
    },

    /**
     * 申诉审核
     */
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
