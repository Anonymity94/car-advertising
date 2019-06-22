import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import { queryAdmins, updateAdmin, createAdmin, deleteAdmin } from '@/services/admin';

export default modelExtend(model, {
  namespace: 'adminModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/user/admins') {
          dispatch({
            type: 'queryAdmins',
          });
        }
      });
    },
  },

  state: {
    list: [], // 管理员列表
  },

  effects: {
    /**
     * 获取所有管理员列表
     */
    *queryAdmins({ payload = {} }, { call, put }) {
      const { success, result } = yield call(queryAdmins, payload);
      yield put({
        type: 'updateState',
        payload: {
          list: success ? result : [],
        },
      });
    },

    /**
     * 修改管理员
     */
    *updateAdmin({ payload }, { call, put }) {
      const { success } = yield call(updateAdmin, payload);
      if (success) {
        message.success('修改成功');
        yield put({
          type: 'queryAdmins',
        });
      } else {
        message.error('修改失败');
      }
      return success;
    },

    /**
     * 新建管理员
     */
    *createAdmin({ payload }, { call, put }) {
      const { success } = yield call(createAdmin, payload);
      if (success) {
        message.success('新增成功');
        yield put({
          type: 'queryAdmins',
        });
      } else {
        message.error('新增失败');
      }
      return success;
    },

    /**
     * 删除
     */
    *deleteAdmin({ payload }, { call, put }) {
      const { success } = yield call(deleteAdmin, payload);
      if (success) {
        message.success('删除成功');
        yield put({
          type: 'queryAdmins',
        });
      } else {
        message.error('删除失败');
      }
      return success;
    },
  },
});
