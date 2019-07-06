import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import { wechatAuthorize } from '@/services/wechat';

export default modelExtend(model, {
  namespace: 'wechatModel',

  state: {
    APPID: '', // 微信 appid
  },

  effects: {
    *wechatAuthorize(_, { call }) {
      const { success, result } = yield call(wechatAuthorize, {
        scope: 'snsapi_base',
        state: '123#wechat_redirect',
      });

      console.log(success, result);
    },
  },
});
