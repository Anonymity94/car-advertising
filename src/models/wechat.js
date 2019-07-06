import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import { wechatAuthorize, wechatAccess } from '@/services/wechat';

export default modelExtend(model, {
  namespace: 'wechatModel',

  state: {
    APPID: '', // 微信 appid
  },

  effects: {
    *wechatAuthorize(_, { call }) {
      yield call(wechatAuthorize, {
        scope: 'snsapi_base',
        state: 'STATE',
      });
    },
    *wechatAccess({ payload }, { call }) {
      yield call(wechatAccess, {
        code: payload.code,
      });
    },
  },
});
