import store from 'store';
import router from 'umi/router';
import { stringify } from 'qs';
import { queryCurrent } from '@/services/login';

export default {
  namespace: 'global',

  state: {
    collapsed: false,

    currentUser: {}, // currentUser
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'queryCurrentUser' });
    },
  },

  effects: {
    *queryCurrentUser({ payload }, { call, put, select }) {
      // store isInit to prevent query trigger by refresh
      const isInit = store.get('isInit');
      if (isInit) return;
      const { locationPathname } = yield select(_ => _.app);
      const { success, result } = yield call(queryCurrent, payload);
      if (success && result.name !== 'unknow') {
        store.set('isInit', true);

        // 填充当前登录人
        yield put({
          type: 'saveCurrentUser',
          payload: result,
        });

        // 跳转到主页
        router.push({
          pathname: '/',
        });
      } else {
        router.push({
          pathname: '/login',
          search: stringify({
            from: locationPathname,
          }),
        });
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
  },
};
