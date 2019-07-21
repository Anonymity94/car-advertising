import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import _ from 'lodash';
import {
  queryActivities,
  createActivity,
  updateActivity,
  publishActivity,
  topActivity,
  deleteActivity,
  queryActivityContent,
  checkUserJoinState,
  joinActivity,
} from '@/services/activity';
import { PUBLISH_STATE_NO } from '@/common/constants';

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

      let list = success ? result : [];
      // 微信端过滤出已发布的
      if (payload.isPublish) {
        list = list.filter(item => item.isPublish === payload.isPublish);
      }

      // 列表中信息未发布状态的信息在最上，
      // 未发布状态以添加的时间的顺序进行排序；
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
     * 活动详情
     */
    *queryActivityContent({ payload }, { call, put }) {
      // 先清空
      yield put({
        type: 'updateState',
        payload: {
          detail: {},
        },
      });

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

    /**
     * 检查某个人是否已经参与过某个活动
     */
    *checkUserJoinState({ payload }, { call }) {
      return yield call(checkUserJoinState, payload);
    },

    /**
     * 参加活动
     */
    *joinActivity({ payload }, { call }) {
      const { success } = yield call(joinActivity, payload);
      return success;
    },
  },
});
