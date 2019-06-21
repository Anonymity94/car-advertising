/**
 * 商户管理
 */

import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询商户列表
 */
export async function queryBusinesses(params) {
  return request(`/api/businesses?${stringify(params)}`);
}

/**
 * 查询商户内容
 * @param {String} id
 */
export async function queryBusinessContent({ id }) {
  return request(`/api/businesses/${id}`);
}

/**
 * 修改商户
 * @param {String} id
 */
export async function updateBusiness({ id, ...resetParams }) {
  return request(`/api/businesses/${id}`, {
    method: 'POST',
    body: {
      method: 'put',
      ...resetParams,
    },
  });
}

/**
 * 删除商户
 * @param {String} id
 */
export async function deleteBusiness({ id }) {
  return request(`/api/businesses/${id}`, {
    method: 'POST',
    body: {
      method: 'delete',
    },
  });
}
