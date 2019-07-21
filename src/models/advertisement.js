import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import _ from 'lodash';
import {
  queryAds,
  createAd,
  updateAd,
  publishAd,
  topAd,
  deleteAd,
  queryAdContent,
} from '@/services/advertisement';
import { PUBLISH_STATE_NO } from '@/common/constants';

export default modelExtend(model, {
  namespace: 'adModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/application/ads') {
          dispatch({
            type: 'queryAds',
          });
        }
      });
    },
  },

  state: {
    list: [], // 所有的
    detail: {},
  },

  effects: {
    /**
     * 获取广告列表
     */
    *queryAds({ payload = {} }, { call, put }) {
      const { success, result } = yield call(queryAds, payload);

      let list = success ? result : [];
      // 微信端过滤出已发布的
      if (payload.isPublish) {
        list = list.filter(item => item.isPublish === payload.isPublish);
      }

      // 列表中信息未发布状态的信息在最上，
      // 未发布状态以添加广告的时间的顺序进行排序；
      // 其他状态在未发布状态的信息下面以发布时间的倒序进行展示；
      let unPublishList = [];
      let otherList = [];
      list.forEach(item => {
        if (item.isPublish === PUBLISH_STATE_NO) {
          unPublishList.push(item);
        } else {
          otherList.push(item);
        }
      });

      unPublishList = _.sortBy(unPublishList, [o => +new Date(o.createTime)]);
      otherList = _.sortBy(otherList, [o => -+new Date(o.publishTime)]);
      list = [...unPublishList, ...otherList];

      yield put({
        type: 'updateState',
        payload: {
          list,
        },
      });
      return {
        success,
        list,
      };
    },

    /**
     * 广告详情
     */
    *queryAdContent({ payload }, { call, put }) {
      // 先清空
      yield put({
        type: 'updateState',
        payload: {
          detail: {},
        },
      });

      const { success, result } = yield call(queryAdContent, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });

      return success ? result : {};
    },

    /**
     * 新增广告
     */
    *createAd({ payload }, { call }) {
      const { success } = yield call(createAd, payload);
      if (success) {
        message.success('新增广告成功');
      } else {
        message.error('新增广告失败');
      }
      return success;
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
    *publishAd({ payload }, { call, put }) {
      const { success } = yield call(publishAd, payload);
      if (success) {
        message.success('操作成功');
        yield put({
          type: 'queryAds',
        });
      } else {
        message.error('操作失败');
      }
      return success;
    },

    /**
     * 置顶广告
     */
    *topAd({ payload }, { call, put }) {
      const { success } = yield call(topAd, payload);
      if (success) {
        message.success('操作成功');
        yield put({
          type: 'queryAds',
        });
      } else {
        message.error('操作失败');
      }
      return success;
    },

    /**
     * 删除广告
     */
    *deleteAd({ payload }, { call, put }) {
      const { success } = yield call(deleteAd, payload);
      if (success) {
        message.success('删除成功');
        yield put({
          type: 'queryAds',
        });
      } else {
        message.error('删除失败');
      }
      return success;
    },
  },
});
