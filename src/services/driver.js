import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询所有的注册车主
 * @param {*} params
 */
export async function queryDrivers(params) {
  return request(`/api/drivers?${stringify(params)}`);
}

/**
 * 查询用户详情
 * @param {String} id
 */
export async function queryDriverById({ id }) {
  return request(`/api/drivers/${id}`);
}

/**
 * 用户审核
 * @param {String} id
 * @param {String} state
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
