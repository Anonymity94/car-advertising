import { WECHAT_APPID } from '@/common/constants';
import { upload } from '@/services/api';
import { notification } from 'antd';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
  },

  effects: {
    *upload({ payload }, { call }) {
      return yield call(upload, payload);
    },
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

  subscriptions: {
    setup({ dispatch, history }) {
      const { pathname, query } = history.location;
      if (pathname.indexOf('h5') === -1 && pathname.indexOf('/wechat/') === -1) {
        notification.destroy();
        dispatch({ type: 'login/queryLoggedUser' });
        // 30秒定时
        setInterval(() => dispatch({ type: 'login/queryLoggedUser' }), 30 * 1000);
      } else {
        if (pathname.indexOf('/wechat/') > -1) {
          return;
        }
        const { code } = query;
        if (!code) {
          const httpUrl = encodeURIComponent(`${window.location}`);
          const redirectUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WECHAT_APPID}&redirect_uri=${httpUrl}&response_type=code&scope=snsapi_base&state=232#wechat_redirect`;
          if (!IS_DEV) {
            window.location.href = redirectUrl;
          }
        } else {
          // 如果有code
          dispatch({
            type: 'wechatModel/wechatAccess',
            payload: {
              code,
            },
          });
        }
      }
    },
  },
};
