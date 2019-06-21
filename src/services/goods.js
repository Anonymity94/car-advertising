/**
 * 商品积分管理
 */

import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询商品列表
 */
export async function queryGoods(params) {
  return request(`/api/goods?${stringify(params)}`);
}

/**
 * 查询商品内容
 * @param {String} id
 */
export async function queryGoodsContent({ id }) {
  return request(`/api/goods/${id}`);
}

/**
 * 新建商品
 */
export async function createGoods(params) {
  return request(`/api/goods`, {
    method: 'POST',
    body: {
      method: 'post',
      ...params,
    },
  });
}

/**
 * 修改商品
 * @param {String} id
 */
export async function updateGoods({ id, ...resetParams }) {
  return request(`/api/goods/${id}`, {
    method: 'POST',
    body: {
      method: 'put',
      ...resetParams,
    },
  });
}

/**
 * 发布|取消发布 商品
 * @param {String} id
 * @param {String} id
 */
export async function publishGoods({ id, isPublish }) {
  return request(`/api/goods/${id}/publish`, {
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
export async function topGoods({ id, isTop }) {
  return request(`/api/goods/${id}/top`, {
    method: 'POST',
    body: {
      method: 'put',
      isTop,
    },
  });
}

/**
 * 删除商品
 * @param {String} id
 */
export async function deleteGoods({ id }) {
  return request(`/api/goods/${id}`, {
    method: 'POST',
    body: {
      method: 'delete',
    },
  });
}
