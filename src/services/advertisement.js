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
  return request(`/api/poster?${stringify(params)}`);
}

/**
 * 查询广告内容
 * @param {String} id
 */
export async function queryAdContent({ id }) {
  return request(`/api/poster/${id}`);
}

/**
 * 新增广告
 */
export async function createAd(params) {
  return request(`/api/poster`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 修改广告
 * @param {String} id
 */
export async function updateAd({ id, ...resetParams }) {
  return request(`/api/poster/${id}`, {
    method: 'PUT',
    body: {
      ...resetParams,
    },
  });
}

/**
 * 发布|取消发布 广告
 * @param {String} id
 * @param {String} isPublish
 */
export async function publishAd({ id, isPublish }) {
  return request(`/api/poster/${id}/publish`, {
    method: 'PUT',
    body: {
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
  return request(`/api/poster/${id}/top`, {
    method: 'PUT',
    body: {
      isTop,
    },
  });
}

/**
 * 删除广告
 * @param {String} id
 */
export async function deleteAd({ id }) {
  return request(`/api/poster/${id}`, {
    method: 'DELETE',
    body: {},
  });
}

/**
 * 检查广告的签约情况
 * @param {String} id
 */
export async function checkUserSigningState({ id }) {
  return request(`/api/poster/${id}/check-signing`, {
    method: 'GET',
  });
}

/**
 * 查询广告签约详情
 */
export async function queryAdSigningDetail({ id }) {
  return request(`/api/ad-signings/detail?id=${id}`);
}

/**
 * 查询广告粘贴列表
 */
export async function queryAdPastes() {
  return request('/api/ad-signings/pastes');
}

/**
 * 开始粘贴
 */
export async function beginPaste({ id }) {
  return request(`/api/ad-signings/saoma?id=${id}`, {
    method: 'PUT',
  });
}

/**
 * 允许粘贴
 */
export async function accessAdPaste({ id, ...rest }) {
  return request(`/api/ad-signings/access-paste?id=${id}`, {
    method: 'POST',
    body: { ...rest },
  });
}

/**
 * 拒绝粘贴
 */
export async function rejectAdPaste({ id, ...rest }) {
  return request(`/api/ad-signings/reject-paste?id=${id}`, {
    method: 'POST',
    body: { ...rest },
  });
}

/**
 * 查询广告结算列表
 */
export async function queryAdSettlements() {
  return request('/api/ad-signings/settlements');
}

/**
 * 查询广告结算详情
 */
export async function queryAdSettlementDetail({ id }) {
  return request(`/api/ad-signings/signing-detail?id=${id}`);
}

/**
 * 广告签约
 */
export async function doSigning(params) {
  return request('/api/ad-signings', {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 广告结算
 */
export async function doSigningSettlement({ id, ...rest }) {
  return request(`/api/ad-signings/settlements?id=${id}`, {
    method: 'POST',
    body: { ...rest },
  });
}
