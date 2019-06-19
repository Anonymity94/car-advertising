import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { pageModel, doPageRequest } from '@/utils/model';
import {
  queryAds,
  updateAd,
  publishAd,
  topAd,
  deleteAd,
  queryAdContent,
} from '@/services/advertisement';

export default modelExtend(pageModel, {
  namespace: 'adModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/application/ads') {
          const payload = { ...location.query };
          dispatch({
            type: 'queryAds',
            payload,
          });
        }
      });
    },
  },

  state: {
    ads: [], // 管理员列表
    detail: {},
  },

  effects: {
    /**
     * 获取广告列表
     */
    *queryAds({ payload = {} }, { call, put }) {
      yield doPageRequest({ api: queryAds, payload, call, put, stateKey: 'ads' });
    },

    /**
     * 广告详情
     */
    *queryAdContent({ payload }, { call, put }) {
      const { success, result } = yield call(queryAdContent, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },

    /**
     * 修改广告内容
     */
    *updateAd({ payload }, { call }) {
      const { success } = yield call(updateAd, payload);
      if (success) {
        message.success('内容修改成功');
      } else {
        message.error('内容修改失败');
      }
      return success;
    },

    /**
     * 发布广告
     */
    *publishAd({ payload }, { call }) {
      const { success } = yield call(publishAd, payload);
      if (success) {
        message.success('发布成功');
      } else {
        message.error('发布失败');
      }
      return success;
    },

    /**
     * 置顶广告
     */
    *topAd({ payload }, { call }) {
      const { success } = yield call(topAd, payload);
      if (success) {
        message.success('置顶成功');
      } else {
        message.error('置顶失败');
      }
      return success;
    },

    /**
     * 删除广告
     */
    *deleteAd({ payload }, { call }) {
      const { success } = yield call(deleteAd, payload);
      if (success) {
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
      return success;
    },
  },
});
