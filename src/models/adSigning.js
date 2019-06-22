/**
 * 广告签约管理
 */

import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import {
  queryAdPastes,
  queryAdSettlements,
  queryAdSigningDetail,
  accessAdPaste,
  rejectAdPaste,
  doSigningSettlement,
} from '@/services/advertisement';

export default modelExtend(model, {
  namespace: 'adSigningModel',

  state: {
    list: [],
    detail: {},
  },

  effects: {
    /**
     * 获取广告粘贴列表【未结算】
     */
    *queryAdPastes({ payload = {} }, { call, put }) {
      const { success, result } = yield call(queryAdPastes, payload);
      yield put({
        type: 'updateState',
        payload: {
          list: success ? result : [],
        },
      });
    },

    /**
     * 获取广告结算列表【已经粘贴完成了】
     */
    *queryAdSettlements({ payload = {} }, { call, put }) {
      const { success, result } = yield call(queryAdSettlements, payload);
      yield put({
        type: 'updateState',
        payload: {
          list: success ? result : [],
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
    },

    /**
     * 允许粘贴广告
     */
    *accessAdPaste({ payload }, { call, put }) {
      const { success } = yield call(accessAdPaste, payload);
      if (success) {
        message.success('广告粘贴完成');
        yield put({
          type: 'queryAdPastes',
        });
      } else {
        message.error('广告粘贴失败');
      }
      return success;
    },

    /**
     * 拒绝粘贴广告
     */
    *rejectAdPaste({ payload }, { call, put }) {
      const { success } = yield call(rejectAdPaste, payload);
      if (success) {
        message.success('广告拒绝粘贴完成');
        yield put({
          type: 'queryAdPastes',
        });
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
