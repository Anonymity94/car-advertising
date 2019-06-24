import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import {
  queryActivities,
  createActivity,
  updateActivity,
  publishActivity,
  topActivity,
  deleteActivity,
  queryActivityContent,
} from '@/services/activity';

export default modelExtend(model, {
  namespace: 'activityModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/application/activities') {
          dispatch({
            type: 'queryActivities',
          });
        }
      });
    },
  },

  state: {
    list: [], // 活动列表
    detail: {},
  },

  effects: {
    /**
     * 获取活动列表
     */
    *queryActivities({ payload = {} }, { call, put }) {
      const { success, result } = yield call(queryActivities, payload);
      yield put({
        type: 'updateState',
        payload: {
          list: success ? result : [],
        },
      });
    },

    /**
     * 活动详情
     */
    *queryActivityContent({ payload }, { call, put }) {
      const { success, result } = yield call(queryActivityContent, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },

    /**
     * 新建活动
     */
    *createActivity({ payload }, { call }) {
      const { success } = yield call(createActivity, payload);
      if (success) {
        message.success('新建活动成功');
      } else {
        message.error('新建活动失败');
      }
      return success;
    },

    /**
     * 修改活动内容
     */
    *updateActivity({ payload }, { call }) {
      const { success } = yield call(updateActivity, payload);
      if (success) {
        message.success('内容修改成功');
      } else {
        message.error('内容修改失败');
      }
      return success;
    },

    /**
     * 发布活动
     */
    *publishActivity({ payload }, { call, put }) {
      const { success } = yield call(publishActivity, payload);
      if (success) {
        message.success('操作成功');
        yield put({
          type: 'queryActivities',
        });
      } else {
        message.error('操作失败');
      }
      return success;
    },

    /**
     * 置顶活动
     */
    *topActivity({ payload }, { call, put }) {
      const { success } = yield call(topActivity, payload);
      if (success) {
        message.success('操作成功');
        yield put({
          type: 'queryActivities',
        });
      } else {
        message.error('操作失败');
      }
      return success;
    },

    /**
     * 删除活动
     */
    *deleteActivity({ payload }, { call, put }) {
      const { success } = yield call(deleteActivity, payload);
      if (success) {
        message.success('删除成功');
        yield put({
          type: 'queryActivities',
        });
      } else {
        message.error('删除失败');
      }
      return success;
    },
  },
});
