/**
 * 广告内容管理
 */

import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询广告列表
 */
export async function queryAds(params) {
  // return request(`/api/advertisements?${stringify(params)}`);
  return request(`/api/ads?${stringify(params)}`);
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
 * 发布|取消发布 广告
 * @param {String} id
 * @param {String} id
 */
export async function publishAd({ id, isPublish }) {
  return request(`/api/advertisements/${id}/publish`, {
    method: 'POST',
    body: {
      method: 'put',
      isPublish,
    },
  });
}

/**
 * 置顶|取消置顶 广告
 * @param {String} id
 * @param {String} isTop
 */
export async function topAd({ id, isTop }) {
  return request(`/api/advertisements/${id}/top`, {
    method: 'POST',
    body: {
      method: 'put',
      isTop,
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

/**
 * 查询广告签约详情
 */
export async function queryAdSigningDetail({ id }) {
  return request(`/api/advertisement-signings/detail?id=${id}`);
}

/**
 * 查询广告粘贴列表
 */
export async function queryAdPastes() {
  return request('/api/advertisement-signings/pastes');
}

/**
 * 允许粘贴
 */
export async function accessAdPaste({ id, ...rest }) {
  return request(`/api/advertisement-signings/access-paste?id=${id}`, {
    method: 'POST',
    body: { ...rest },
  });
}

/**
 * 拒绝粘贴
 */
export async function rejectAdPaste({ id, ...rest }) {
  return request(`/api/advertisement-signings/reject-paste?id=${id}`, {
    method: 'POST',
    body: { ...rest },
  });
}

/**
 * 查询广告结算列表
 */
export async function queryAdSettlements() {
  return request('/api/advertisement-signings/settlements');
}

/**
 * 广告结算
 */
export async function doSigningSettlement({ id, ...rest }) {
  return request(`/api/advertisement-signings/settlements?id=${id}`, {
    method: 'POST',
    body: { ...rest },
  });
}
