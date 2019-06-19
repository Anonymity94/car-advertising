import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { pageModel, doPageRequest } from '@/utils/model';
import { queryAdmins, updateAdminPassword, deleteAdmin } from '@/services/admin';

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
     * 修改密码
     */
    *updateAdminPassword({ payload }, { call }) {
      const { success } = yield call(updateAdminPassword, payload);
      if (success) {
        message.success('修改密码成功');
      } else {
        message.error('修改密码失败');
      }
      return success;
    },

    /**
     * 修改密码
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
