/**
 * 用户管理
 */

import { stringify } from 'qs';
import request from '@/utils/request';
import { AUDIT_STATE_PASSED } from '@/common/constants';

/**
 * 查询注册车主列表
 */
export async function queryDrivers() {
  return request('/api/user-manager/user-list');
}

/**
 * 查询已通过的车主列表
 * @param {*} params
 */
export async function queryApprovedDrivers(params) {
  return request(`/api/drivers?${stringify({ ...params, state: AUDIT_STATE_PASSED })}`);
}

/**
 * 查询车主详情
 * @param {String} id
 */
export async function queryDriverById({ id }) {
  return request(`/api/user-manager/user-single?id=${id}`);
}

/**
 * 用户审核
 * @param {String} id
 * @param {String} state
 * @param {String} reason
 */
export async function auditDriver({ id, state, reason }) {
  const api = state === AUDIT_STATE_PASSED ? 'user-access' : 'user-reject';
  return request(`/api/user-manager/${api}?id=${id}`, {
    method: 'POST',
    body: {
      method: 'put',
      reason,
    },
  });
}

/**
 * 更新行驶证的到期时间
 * @param {Stirng} id 用户id
 * @param {Stirng} expireTime  行驶证的到期日期
 */
export async function updateDriverExpireTime({ id, expireTime }) {
  return request(`/api/user-manager/user-update?id=${id}`, {
    method: 'POST',
    body: {
      method: 'put',
      expireTime,
    },
  });
}

/**
 * 删除
 * @param {String} id
 */
export async function deleteDriver({ id }) {
  return request(`/api/user-manager/user-remove?id=${id}`, {
    method: 'DELETE',
    body: {},
  });
}
