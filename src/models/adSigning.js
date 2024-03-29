/**
 * 广告签约管理
 */

import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import _ from 'lodash';
import moment from 'moment';
import {
  queryAdPastes,
  queryAdSettlements,
  queryAdSigningDetail,
  accessAdPaste,
  rejectAdPaste,
  doSigning,
  queryAdSettlementDetail,
  doSigningSettlement,
  beginPaste,
} from '@/services/advertisement';
import {
  AD_PASTE_STATE_UN_PASTED,
  SIGNING_GOLD_SETTLEMENT_STATE_SETTLED,
} from '@/common/constants';
import { Toast } from 'antd-mobile';

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
      const { success, result } = yield call(queryAdPastes, payload);

      // 排序
      let list = success ? result : [];

      // 列表中信息未粘贴状态的信息在最上，
      // 未粘贴状态以扫描二维码时间的顺序进行排序；
      // 其他两种状态在未粘贴状态的信息下面以操作时间的倒序进行展示；
      let unFinishList = [];
      let otherList = [];
      list.forEach(item => {
        if (item.pasteState === AD_PASTE_STATE_UN_PASTED) {
          unFinishList.push(item);
        } else {
          otherList.push(item);
        }
      });

      unFinishList = _.sortBy(unFinishList, [o => +moment(o.scanTime)]);
      otherList = _.sortBy(otherList, [o => -+moment(o.pasteTime)]);
      list = [...unFinishList, ...otherList];

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

      // 列表中信息未结算状态的信息在最上，
      // 未结算状态以粘贴广告时间的顺序进行排序；
      // 其他两种状态在未结算状态的信息下面以结算时间的倒序进行展示；
      let unFinishList = [];
      let otherList = [];
      list.forEach(item => {
        if (item.settlementState !== SIGNING_GOLD_SETTLEMENT_STATE_SETTLED) {
          unFinishList.push(item);
        } else {
          otherList.push(item);
        }
      });

      unFinishList = _.sortBy(unFinishList, [o => +moment(o.pasteTime)]);
      otherList = _.sortBy(otherList, [o => -+moment(o.settlementTime)]);
      list = [...unFinishList, ...otherList];

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
     * 开始粘贴广告
     */
    *beginPaste({ payload }, { call, put }) {
      const { success } = yield call(beginPaste, payload);
      if (success) {
        message.success('扫码完成');
        yield put({
          type: 'queryAdPastes',
        });
      } else {
        message.error('扫码失败');
      }
      return success;
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
