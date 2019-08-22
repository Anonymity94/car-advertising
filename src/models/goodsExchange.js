import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import {
  queryExchangeLogs,
  auditExchange,
  queryExchangeDetail,
  updateExchangeLog,
} from '@/services/goodsExchange';
import {
  BOOLEAN_YES,
  GOOD_EXCHANGE_TYPE_SELF_TAKING,
  GOOD_EXCHANGE_TYPE_SELF_MAIL,
  EXCHANGE_CANCEL_APPROVE,
  EXCHANGE_CANCEL_REFUSE,
  EXCHANGE_CANCEL_WAITING,
  BOOLEAN_NO,
} from '@/common/constants';

export default modelExtend(model, {
  namespace: 'goodsExchangeModel',

  state: {
    totalLogs: [],

    takingFinishLogs: [],
    tobeMailedLogs: [],
    tobeGivebackLogs: [],
    givebackFinishLogs: [],
    mailedFinishLogs: [],

    finishLogs: [], // 总共完成的
  },

  effects: {
    /**
     * 查询某个商户下商品兑换情况
     */
    *queryExchangeLogs({ payload }, { call, put }) {
      const { success, result } = yield call(queryExchangeLogs, payload);

      // 根据状态区分
      const takingFinishLogs = []; // 自取已兑换客户 state=1&exchangeType=0
      const tobeMailedLogs = []; // 待邮寄 state=0&exchangeType=1&[0,3].indexOf(cancelState) > -1
      const tobeGivebackLogs = []; // 待退还 cancelState=1
      const givebackFinishLogs = []; // 已退还完成 cancelState=2
      const mailedFinishLogs = []; // 已邮寄完成。state=1&exchangeType=1
      const finishLogs = []; // 兑换完成的，不区分兑换方式 state=1

      if (success && Array.isArray(result)) {
        result.forEach(item => {
          const { state, exchangeType, cancelState } = item;
          // 自取已完成
          if (state === BOOLEAN_YES && exchangeType === GOOD_EXCHANGE_TYPE_SELF_TAKING) {
            takingFinishLogs.push(item);
          }
          // 待邮寄
          if (
            state === BOOLEAN_NO &&
            exchangeType === GOOD_EXCHANGE_TYPE_SELF_MAIL &&
            cancelState !== EXCHANGE_CANCEL_APPROVE &&
            cancelState !== EXCHANGE_CANCEL_REFUSE
          ) {
            tobeMailedLogs.push(item);
          }
          // 待退还
          if (cancelState === EXCHANGE_CANCEL_WAITING) {
            tobeGivebackLogs.push(item);
          }

          // 退还完成
          if (cancelState === EXCHANGE_CANCEL_APPROVE) {
            givebackFinishLogs.push(item);
          }

          // 邮寄完成
          if (state === BOOLEAN_YES && exchangeType === GOOD_EXCHANGE_TYPE_SELF_MAIL) {
            mailedFinishLogs.push(item);
          }

          // 不区分兑换类型，用户总完成的
          if (state === BOOLEAN_YES) {
            finishLogs.push(item);
          }
        });
      }

      yield put({
        type: 'updateState',
        payload: {
          takingFinishLogs,
          tobeMailedLogs,
          tobeGivebackLogs,
          givebackFinishLogs,
          mailedFinishLogs,
          finishLogs,
          totalLogs: success ? result : [],
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

    *updateExchangeLog({ payload }, { call }) {
      const { success } = yield call(updateExchangeLog, payload);
      return success;
    },
  },
});
