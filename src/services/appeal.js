/**
 * 用户申诉
 */

import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询申诉列表
 * @param {*} params
 */
export async function queryAppeals(params) {
  return request(`/api/appeals?${stringify(params)}`);
}

/**
 * 申诉审核
 * @param {String} id
 * @param {String} state
 * @param {String} reason
 */
export async function updateAppealState({ id, state, reason }) {
  return request(`/api/appeals/${id}/state`, {
    method: 'PUT',
    body: {
      state,
      reason,
    },
  });
}
