/**
 * 用户管理
 */

import { stringify } from 'qs';
import request from '@/utils/request';
import { AUDIT_STATE_PASSED } from '@/common/constants';

/**
 * 查询注册车主列表
 * @param {*} params
 */
export async function queryDrivers(params) {
  return request(`/api/drivers?${stringify(params)}`);
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
  return request(`/api/drivers/${id}`);
}

/**
 * 用户审核
 * @param {String} id
 * @param {String} state
 * @param {String} reason
 */
export async function updateDriverState({ id, state, reason }) {
  return request(`/api/drivers/${id}/state`, {
    method: 'POST',
    body: {
      method: 'put',
      state,
      reason,
    },
  });
}

/**
 * 更新行驶证的到期时间
 * @param {Stirng} id 用户id
 * @param {Stirng} drivingPermitDueTime  行驶证的到期日期
 */
export async function updateDrivingPermitDueTime({ id, drivingPermitDueTime }) {
  return request(`/api/drivers/${id}/drivingPermitDueTime`, {
    method: 'POST',
    body: {
      method: 'put',
      drivingPermitDueTime,
    },
  });
}

/**
 * 删除
 * @param {String} id
 */
export async function deleteDriver({ id }) {
  return request(`/api/drivers/${id}`, {
    method: 'POST',
    body: {
      method: 'delete',
    },
  });
}
