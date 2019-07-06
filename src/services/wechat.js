import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 微信鉴权
 */
export async function wechatAuthorize(params) {
  return request(`/api/account/wechat/authorize?${stringify(params)}`);
}

export async function wechatAccess({ code }) {
  return request(`/api/account/wechat/access/${code}`);
}
