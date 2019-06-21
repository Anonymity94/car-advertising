/**
 * 管理员
 */

import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询管理员列表
 */
export async function queryAdmins(params) {
  return request(`/api/user-manager/admin-list?${stringify(params)}`);
}

/**
 * 修改管理员
 * @param {String} id
 * @param {String} username
 * @param {String} password
 * @param {String} name
 */
export async function updateAdmin({ id, ...restParams }) {
  return request(`/api/user-manager/admin-update?id=${id}`, {
    method: 'POST',
    body: {
      method: 'put',
      ...restParams,
    },
  });
}

/**
 * 新增管理员
 * @param {String} username
 * @param {String} password
 * @param {String} name
 */
export async function createAdmin(params) {
  return request('/api/user-manager/admin-register', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 删除管理员
 * @param {String} id
 */
export async function deleteAdmin({ id }) {
  return request(`/api/user-manager/admin-remove?id=${id}`, {
    method: 'POST',
    body: {
      method: 'delete',
    },
  });
}
