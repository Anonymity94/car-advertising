export default {
  namespace: 'global',

  state: {
    collapsed: false,
  },

  effects: {},

  reducers: {
    changeState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      const { pathname } = history.location;
      if (pathname.indexOf('h5') === -1) {
        dispatch({ type: 'login/queryLoggedUser' });
      } else {
        dispatch({ type: 'wechatModel/wechatAuthorize' });
        // dispatch({ type: 'login/queryWechatUser' });
      }
    },
  },
};
