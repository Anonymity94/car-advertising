/**
 * 活动内容管理
 */

import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询活动列表
 */
export async function queryActivities(params) {
  return request(`/api/activities?${stringify(params)}`);
}

/**
 * 查询活动内容
 * @param {String} id
 */
export async function queryActivityContent({ id }) {
  return request(`/api/activities/${id}`);
}

/**
 * 修改活动
 * @param {String} id
 */
export async function updateActivity({ id, ...resetParams }) {
  return request(`/api/activities/${id}`, {
    method: 'POST',
    body: {
      method: 'put',
      ...resetParams,
    },
  });
}

/**
 * 发布|取消发布 活动
 * @param {String} id
 * @param {String} id
 */
export async function publishActivity({ id, isPublish }) {
  return request(`/api/activities/${id}/publish`, {
    method: 'POST',
    body: {
      method: 'put',
      isPublish,
    },
  });
}

/**
 * 置顶|取消置顶 活动
 * @param {String} id
 * @param {String} isTop
 */
export async function topActivity({ id, isTop }) {
  return request(`/api/activities/${id}/top`, {
    method: 'POST',
    body: {
      method: 'put',
      isTop,
    },
  });
}

/**
 * 删除活动
 * @param {String} id
 */
export async function deleteActivity({ id }) {
  return request(`/api/activities/${id}`, {
    method: 'POST',
    body: {
      method: 'delete',
    },
  });
}
