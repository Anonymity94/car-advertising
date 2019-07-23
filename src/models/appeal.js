import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import _ from 'lodash';
import moment from 'moment';
import { queryAppeals, updateAppealState, createAppeal } from '@/services/appeal';
import router from 'umi/router';
import { AUDIT_STATE_UNREVIEWED } from '@/common/constants';

export default modelExtend(model, {
  namespace: 'appealModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/application/appeals') {
          dispatch({
            type: 'queryAppeals',
          });
        }
      });
    },
  },

  state: {
    list: [], // 申诉列表
  },

  effects: {
    /**
     * 获取所有申诉列表
     */
    *queryAppeals({ payload = {} }, { call, put }) {
      const { success, result } = yield call(queryAppeals, payload);

      // 排序
      let list = success ? result : [];
      // 列表中信息未审核状态的信息在最上，
      // 未审核状态以前端用户提交时间的顺序进行排序；
      // 其他两种状态在未审核状态的信息下面以审核时间的倒序进行展示；
      let unFinishList = [];
      let otherList = [];
      list.forEach(item => {
        if (item.status === AUDIT_STATE_UNREVIEWED) {
          unFinishList.push(item);
        } else {
          otherList.push(item);
        }
      });

      unFinishList = _.sortBy(unFinishList, [o => +moment(o.createTime)]);
      otherList = _.sortBy(otherList, [o => -+moment(o.accessTime)]);
      list = [...unFinishList, ...otherList];

      yield put({
        type: 'updateState',
        payload: {
          list,
        },
      });
    },

    /**
     * 用户提起申诉
     */
    *createAppeal({ payload }, { call }) {
      const { success } = yield call(createAppeal, payload);
      if (success) {
        router.push('/h5/user/waiting');
      } else {
        message.error('申诉成功失败');
      }
      return success;
    },

    /**
     * 申诉审核
     */
    *updateAppealState({ payload }, { call, put }) {
      const { success } = yield call(updateAppealState, payload);
      if (success) {
        message.success('审核成功');
        yield put({
          type: 'queryAppeals',
        });
      } else {
        message.error('审核失败');
      }
      return success;
    },
  },
});
