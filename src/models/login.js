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
    status: undefined,
    currentUser: {},
    wechatUser: {},
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { success, result } = yield call(login, payload);

      if (result.result === 'failure') {
        message.error(result.message);
        return;
      }

      if (payload.from === 'wechat-qrcode' && payload.redirect_url) {
        router.push(payload.redirect_url);
        return;
      }

      // Login successfully
      // 获取登陆用户信息
      yield put({
        type: 'queryLoggedUser',
        payload: {
          from: payload.from || 'login',
          redirect_url: payload.redirect_url,
        },
      });
    },

    *queryWechatUser(_, { call, put }) {
      const { success, result } = yield call(queryCurrent);

      if (success && result.id) {
        // 填充当前登录人
        yield put({
          type: 'changeState',
          payload: {
            wechatUser: result,
            status: true,
          },
        });

        // 获取用户详情
        yield put({
          type: 'driverModel/queryDriverDetail',
          payload: {
            id: result.id,
            from: 'queryWechatUser',
          },
        });
      } else {
        yield put({
          type: 'changeState',
          payload: {
            wechatUser: {},
            status: false,
          },
        });
        // router.push({
        //   pathname: '/h5/user/bind',
        // });
      }
    },

    *queryLoggedUser({ payload = {} }, { call, put }) {
      const { from } = payload;
      const { success, result } = yield call(queryCurrent);

      if (success && result.id) {
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
        if (from === 'wechat-qrcode') {
          return;
        }
        if (from === 'login') {
          // 跳转到主页
          router.push({
            pathname: '/',
          });
        }
      } else if (!from) {
          router.push('/login');
        } else {
          router.push(
            `/login?from=${from}&redirect_url=${window.location.pathname}${window.location.search}`
          );
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
