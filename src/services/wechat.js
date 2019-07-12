import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 微信鉴权
 */
export async function wechatAuthorize(params) {
  return request(`/api/account/wechat/authorize?${stringify(params)}`);
}

export async function wechatAccess({ code, isDev }) {
  return request(`/api/account/wechat/access/${code}?isDev=${isDev}`);
}

export async function wechatLogin() {
  return request('/api/user/wechat-login');
}
