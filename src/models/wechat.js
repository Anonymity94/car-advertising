import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import { wechatAuthorize, wechatAccess, wechatLogin } from '@/services/wechat';
import router from 'umi/router';

const IS_DEV = false;

export default modelExtend(model, {
  namespace: 'wechatModel',

  state: {
    openId: '', // 微信 appid
    checkWechatLoginFinish: false,
  },

  effects: {
    *wechatLogin(_, { call, put }) {
      const { success, result } = yield call(wechatLogin);
      yield put({
        type: 'updateState',
        payload: {
          checkWechatLoginFinish: true,
        },
      });
      if (success && result) {
        yield put({
          type: 'login/queryWechatUser',
        });
      } else {
        // 如果微信用户没有登陆，去绑定
        router.push('/h5/user/bind');
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
          type: 'updateState',
          payload: {
            openId: result.openid,
          },
        });

        yield put({
          type: 'wechatLogin',
        });
      }
    },
  },
});
