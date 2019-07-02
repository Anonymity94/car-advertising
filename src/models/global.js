export default {
  namespace: 'global',

  state: {
    collapsed: false,
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'login/queryCurrentUser' });
    },
  },

  effects: {
  },

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
