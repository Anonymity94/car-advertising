import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import { queryExchangeLogs, auditExchange, queryExchangeDetail } from '@/services/goodsExchange';

export default modelExtend(model, {
  namespace: 'goodsExchangeModel',

  state: {
    goodsExchangeLogs: [], // 商户下所有商品的兑换记录
  },

  effects: {
    /**
     * 查询某个商户下商品兑换情况
     */
    *queryExchangeLogs({ payload }, { call, put }) {
      const { success, result } = yield call(queryExchangeLogs, payload);
      yield put({
        type: 'updateState',
        payload: {
          goodsExchangeLogs: success ? result : [],
        },
      });
    },

    /**
     * 根据兑换码，查询兑换详情
     */
    *queryExchangeDetail({ payload }, { call }) {
      const { success, result } = yield call(queryExchangeDetail, payload);
      if (success) {
        return result || {};
      }
      return {};
    },

    /**
     * 某个商户根据兑换码给用户兑换商品
     */
    *auditExchange({ payload }, { call }) {
      const { success } = yield call(auditExchange, payload);
      if (success) {
        message.success('兑换成功');
      } else {
        message.error('兑换失败');
      }
      return success;
    },
  },
});
