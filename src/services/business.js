/**
 * 商户管理
 */

import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询商户列表
 */
export async function queryBusinesses(params) {
  return request(`/api/businesses?${stringify(params)}`);
}

/**
 * 查询商户内容
 * @param {String} id
 */
export async function queryBusinessContent({ id }) {
  return request(`/api/businesses/${id}`);
}

/**
 * 查询所有商户下的所有未新增的商品
 * @param {String} id
 */
export async function queryAllBusinessGoods() {
  return request(`/api/businesses/all-goods`);
}

/**
 * 新建商户
 */
export async function createBusiness(params) {
  return request(`/api/businesses`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 修改商户
 * @param {String} id
 */
export async function updateBusiness({ id, ...resetParams }) {
  return request(`/api/businesses/${id}`, {
    method: 'PUT',
    body: {
      ...resetParams,
    },
  });
}

/**
 * 更新乐蚁果
 * @param {Stirng} id 用户id
 * @param {Number} restIntegral 可用乐蚁果
 * @param {Number} usedIntegral 已使用乐蚁果
 */
export async function updateIntegral({ id, restIntegral, usedIntegral }) {
  return request(
    `/api/businesses/setIntegral?id=${id}&restIntegral=${restIntegral}&usedIntegral=${usedIntegral}`,
    {
      method: 'POST',
    }
  );
}

/**
 * 删除商户
 * @param {String} id
 */
export async function deleteBusiness({ id }) {
  return request(`/api/businesses/${id}`, {
    method: 'DELETE',
    body: {},
  });
}

/**
 * 某个商户用乐蚁果发起提现申请
 */
export async function startIntegralSettlement({ id, integral, telephone, money }) {
  return request(`/api/businesses/${id}/integral-settlement`, {
    method: 'POST',
    body: {
      integral,
      telephone,
      money,
    },
  });
}
