/**
 * 管理员
 */

import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询管理员列表
 */
export async function queryAdmins(params) {
  return request(`/api/admins?${stringify(params)}`);
}

/**
 * 修改管理员密码
 * @param {String} id
 * @param {String} password
 */
export async function updateAdminPassword({ id, password }) {
  return request(`/api/admins/${id}/password`, {
    method: 'POST',
    body: {
      method: 'put',
      password,
    },
  });
}

/**
 * 删除管理员
 * @param {String} id
 */
export async function deleteAdmin({ id }) {
  return request(`/api/admins/${id}`, {
    method: 'POST',
    body: {
      method: 'delete',
    },
  });
}
