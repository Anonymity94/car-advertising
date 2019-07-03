import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import router from 'umi/router';
import { login, logout, queryCurrent } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';

export default {
  namespace: 'login',

  state: {
    isInit: false,
    status: undefined,
    currentUser: {}, // currentUser
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { success, result } = yield call(login, payload);

      if (!success) {
        message.error(result.message);
        return;
      }
      // Login successfully
      // 获取登陆用户信息
      yield put({
        type: 'queryCurrentUser',
      });
    },

    *queryCurrentUser({ payload }, { call, put, select }) {
      const { isInit } = yield select(_ => _.global);
      if (isInit) return;

      const { success, result } = yield call(queryCurrent, payload);
      if (success && result.name !== 'unknow') {
        // 刷新权限
        setAuthority(result.type);
        reloadAuthorized();

        // 填充当前登录人
        yield put({
          type: 'changeState',
          payload: {
            currentUser: result,
            status: true,
          },
        });
        // 跳转到主页
        router.push({
          pathname: '/',
        });
      } else {
        router.push({
          pathname: '/login',
        });
      }
    },

    *logout(_, { call, put }) {
      const { success } = yield call(logout);
      if (success) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'NO_AUTH',
          },
        });
        reloadAuthorized();
        yield put(
          routerRedux.push({
            pathname: '/login',
            search: stringify(),
          })
        );
      }
    },
  },

  reducers: {
    changeState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
