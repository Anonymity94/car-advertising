/**
 * 广告签约管理
 */

import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import _ from 'lodash';
import {
  queryAdPastes,
  queryAdSettlements,
  queryAdSigningDetail,
  accessAdPaste,
  rejectAdPaste,
  doSigning,
  queryAdSettlementDetail,
  doSigningSettlement,
} from '@/services/advertisement';
import { AD_PASTE_STATE_UN_PASTED } from '@/common/constants';

export default modelExtend(model, {
  namespace: 'adSigningModel',

  state: {
    list: [],
    detail: {},
    settleDetail: {},
  },

  effects: {
    /**
     * 广告签约
     */
    *doSigning({ payload = {} }, { call }) {
      const { success } = yield call(doSigning, payload);
      return success;
    },

    /**
     * 获取广告粘贴列表【未结算】
     */
    *queryAdPastes({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          list: [],
        },
      });

      const { success, result } = yield call(queryAdPastes, payload);

      // 排序
      let list = success ? result : [];
      list = _.sortBy(list, ['pasteState'], ['asc']);

      list = list.map(item => ({
        ...item,
        pasteState: !item.pasteState ? AD_PASTE_STATE_UN_PASTED : item.pasteState,
      }));

      yield put({
        type: 'updateState',
        payload: {
          list,
        },
      });
    },

    /**
     * 获取广告结算列表【已经粘贴完成了】
     */
    *queryAdSettlements({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          list: [],
        },
      });

      const { success, result } = yield call(queryAdSettlements, payload);

      // 排序
      let list = success ? result : [];
      list = _.sortBy(list, ['settlementState'], ['asc']);

      yield put({
        type: 'updateState',
        payload: {
          list,
        },
      });
    },

    /**
     * 广告签约详情
     */
    *queryAdSigningDetail({ payload }, { call, put }) {
      const { success, result } = yield call(queryAdSigningDetail, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });

      return success ? result : {};
    },

    /**
     * 广告结算详情
     */
    *queryAdSettlementDetail({ payload }, { call, put }) {
      const { success, result } = yield call(queryAdSettlementDetail, payload);
      yield put({
        type: 'updateState',
        payload: {
          settleDetail: success ? result : {},
        },
      });

      return success ? result : {};
    },

    /**
     * 允许粘贴广告
     */
    *accessAdPaste({ payload }, { call }) {
      const { success } = yield call(accessAdPaste, payload);
      if (success) {
        message.success('广告粘贴完成');
      } else {
        message.error('广告粘贴失败');
      }
      return success;
    },

    /**
     * 拒绝粘贴广告
     */
    *rejectAdPaste({ payload }, { call }) {
      const { success } = yield call(rejectAdPaste, payload);
      if (success) {
        message.success('广告拒绝粘贴完成');
      } else {
        message.error('广告拒绝粘贴失败');
      }
      return success;
    },

    /**
     * 广告签约金结算
     */
    *doSigningSettlement({ payload }, { call }) {
      const { success } = yield call(doSigningSettlement, payload);
      if (success) {
        message.success('结算成功');
      } else {
        message.error('结算失败');
      }
      return success;
    },
  },
});
