import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 微信鉴权
 */
export async function wechatAuthorize(params) {
  return request(`/api/wechat/authorize?${stringify(params)}`);
}
