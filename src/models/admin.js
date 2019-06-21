import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { pageModel, doPageRequest } from '@/utils/model';
import { queryAdmins, updateAdmin, createAdmin, deleteAdmin } from '@/services/admin';

export default modelExtend(pageModel, {
  namespace: 'adminModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/user/admins') {
          const payload = { ...location.query };
          dispatch({
            type: 'queryAdmins',
            payload,
          });
        }
      });
    },
  },

  state: {
    admins: [], // 管理员列表
  },

  effects: {
    /**
     * 获取所有管理员列表
     */
    *queryAdmins({ payload = {} }, { call, put }) {
      yield doPageRequest({ api: queryAdmins, payload, call, put, stateKey: 'admins' });
    },

    /**
     * 修改管理员
     */
    *updateAdmin({ payload }, { call }) {
      const { success } = yield call(updateAdmin, payload);
      if (success) {
        message.success('修改成功');
      } else {
        message.error('修改失败');
      }
      return success;
    },

    /**
     * 新建管理员
     */
    *createAdmin({ payload }, { call }) {
      const { success } = yield call(createAdmin, payload);
      if (success) {
        message.success('新增成功');
      } else {
        message.error('新增失败');
      }
      return success;
    },

    /**
     * 删除
     */
    *deleteAdmin({ payload }, { call }) {
      const { success } = yield call(deleteAdmin, payload);
      if (success) {
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
      return success;
    },
  },
});
