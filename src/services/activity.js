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
 * 新建活动
 */
export async function createActivity(params) {
  return request(`/api/activities`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 修改活动
 * @param {String} id
 */
export async function updateActivity({ id, ...resetParams }) {
  return request(`/api/activities/${id}`, {
    method: 'PUT',
    body: {
      ...resetParams,
    },
  });
}

/**
 * 发布|取消发布 活动
 * @param {String} id
 * @param {String} isPublish
 */
export async function publishActivity({ id, isPublish }) {
  return request(`/api/activities/${id}/publish`, {
    method: 'PUT',
    body: {
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
    method: 'PUT',
    body: {
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
    method: 'DELETE',
    body: {},
  });
}

/**
 * 检查某个人是否已经参与过某个活动
 * @param {String} id 活动id
 */
export async function checkUserJoinState({ id }) {
  return request(`/api/activities/${id}/check-join`, {
    method: 'GET',
  });
}

/**
 * 参加活动
 * @param {String} id
 */
export async function joinActivity({ id }) {
  return request(`/api/activities/${id}`, {
    method: 'POST',
  });
}
