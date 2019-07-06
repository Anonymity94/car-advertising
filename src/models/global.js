export default {
  namespace: 'global',

  state: {
    collapsed: false,
  },

  subscriptions: {
    async setup({ dispatch, history }) {
      const { pathname } = history.location;
      if (pathname.indexOf('/h5') === -1) {
        await dispatch({ type: 'login/queryCurrentUser' });
      }
    },
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
};
