/**
 * 广告内容管理
 */

import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询广告列表
 */
export async function queryAds(params) {
  return request(`/api/advertisements?${stringify(params)}`);
}

/**
 * 查询广告内容
 * @param {String} id
 */
export async function queryAdContent({ id }) {
  return request(`/api/advertisements/${id}`);
}

/**
 * 修改广告
 * @param {String} id
 */
export async function updateAd({ id, ...resetParams }) {
  return request(`/api/advertisements/${id}`, {
    method: 'POST',
    body: {
      method: 'put',
      ...resetParams,
    },
  });
}

/**
 * 发布广告
 * @param {String} id
 */
export async function publishAd({ id }) {
  return request(`/api/advertisements/${id}/publish`, {
    method: 'POST',
    body: {
      method: 'put',
    },
  });
}

/**
 * 置顶广告
 * @param {String} id
 */
export async function topAd({ id }) {
  return request(`/api/advertisements/${id}/top`, {
    method: 'POST',
    body: {
      method: 'put',
    },
  });
}

/**
 * 删除广告
 * @param {String} id
 */
export async function deleteAd({ id }) {
  return request(`/api/advertisements/${id}`, {
    method: 'POST',
    body: {
      method: 'delete',
    },
  });
}
