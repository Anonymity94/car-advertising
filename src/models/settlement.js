import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import { querySettlements, doSettlement } from '@/services/settlement';
import { INTEGRAL_SETTLEMENT_STATE_YES } from '@/common/constants';

export default modelExtend(model, {
  namespace: 'integralSettlementModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/application/integral/settlement') {
          dispatch({
            type: 'querySettlements',
          });
        }
      });
    },
  },

  state: {
    list: [], // 已结算列表
    unpaid: [], // 未结算列表
    detail: {},
  },

  effects: {
    /**
     * 获取所有结算列表
     */
    *querySettlements({ payload = {} }, { call, put }) {
      const { success, result } = yield call(querySettlements, payload);
      // 区分结算状态
      const list = [];
      const unpaid = [];

      if (success) {
        result.forEach(item => {
          if (item.state === INTEGRAL_SETTLEMENT_STATE_YES) {
            list.push(item);
          } else {
            unpaid.push(item);
          }
        });
      }

      yield put({
        type: 'updateState',
        payload: {
          list,
          unpaid,
        },
      });
    },

    /**
     * 积分结算
     */
    *doSettlement({ payload }, { call, put }) {
      const { success } = yield call(doSettlement, payload);
      if (success) {
        message.success('结算成功');
        yield put({
          type: 'querySettlements',
        });
      } else {
        message.error('结算失败');
      }
      return success;
    },
  },
});
