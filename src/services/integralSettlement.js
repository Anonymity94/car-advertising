/**
 * 积分结算管理
 */

import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询所有结算记录（未结算、已结算）
 */
export async function querySettlements(params) {
  return request(`/api/integrals/settlement?${stringify(params)}`);
}

/**
 * 结算
 * @param {String} id
 */
export async function doSettlement({ id }) {
  return request(`/api/integrals/do-settlement?id=${id}`, {
    method: 'PUT',
    body: {
      id,
    },
  });
}
