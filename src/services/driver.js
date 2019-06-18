import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询注册车主列表
 * @param {*} params
 */
export async function queryDrivers(params) {
  return request(`/api/drivers?${stringify(params)}`);
}

/**
 * 查询车主详情
 * @param {String} id
 */
export async function queryDriverById({ id }) {
  return request(`/api/drivers/${id}`);
}

/**
 * 查询申诉列表
 * @param {*} params
 */
export async function queryAppeals(params) {
  return request(`/api/appeals?${stringify(params)}`);
}

/**
 * 用户审核
 * @param {String} id
 * @param {String} state
 * @param {String} reason
 */
export async function updateDriverState({ id, state, reason }) {
  return request(`/api/drivers/${id}`, {
    method: 'POST',
    body: {
      method: 'put',
      state,
      reason,
    },
  });
}

/**
 * 申诉审核
 * @param {String} id
 * @param {String} state
 * @param {String} reason
 */
export async function updateAppealState({ id, state, reason }) {
  return request(`/api/appeals/${id}`, {
    method: 'POST',
    body: {
      method: 'put',
      state,
      reason,
    },
  });
}
