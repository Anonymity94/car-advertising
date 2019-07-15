import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import { wechatAuthorize, wechatAccess, wechatLogin } from '@/services/wechat';

const IS_DEV = true;

export default modelExtend(model, {
  namespace: 'wechatModel',

  state: {
    openid: '', // 微信 appid
  },

  effects: {
    *wechatLogin(_, { call, put }) {
      const { success, result } = yield call(wechatLogin);
      if (success && result) {
        yield put({
          type: 'login/queryWechatUser',
        });
      }
    },
    *wechatAuthorize(_, { call }) {
      yield call(wechatAuthorize, {
        scope: 'snsapi_base',
        state: 'STATE',
        isDev: IS_DEV,
      });
    },
    *wechatAccess({ payload }, { call, put }) {
      const { success, result } = yield call(wechatAccess, {
        code: payload.code,
        isDev: IS_DEV,
      });

      if (success && result.openid) {
        yield put({
          type: 'changeState',
          payload: {
            openid: result.openid,
          },
        });

        yield put({
          type: 'wechatLogin',
          payload: {
            openid: result.openid,
          },
        });
      }
    },
  },
});
