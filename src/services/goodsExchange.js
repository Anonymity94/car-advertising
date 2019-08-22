import request from '@/utils/request';

/**
 * 根据兑换码，查询兑换详情
 * @param {String} exchangeCode
 */
export async function queryExchangeDetail({ exchangeCode }) {
  return request(`/api/goods-ext/exchange/detail?exchangeCode=${exchangeCode}`, {
    method: 'GET',
  });
}

/**
 * 查询某个商户下所有的商品兑换日志
 * @param {String} businessId
 */
export async function queryExchangeLogs({ businessId }) {
  return request(`/api/goods-ext/exchange/logs?businessId=${businessId}`, {
    method: 'GET',
  });
}

/**
 * 通过某个兑换申请
 * @param {String} exchangeCode
 */
export async function auditExchange({ exchangeCode }) {
  return request(`/api/goods-ext/exchange/access`, {
    method: 'POST',
    body: {
      exchangeCode,
    },
  });
}

/**
 * 发起退还申请
 * 审核退还申请
 */
export async function updateExchangeLog({ id, ...restParams }) {
  return request(`/api/goods-ext/exchange/update?id=${id}`, {
    method: 'PUT',
    body: {
      ...restParams,
    },
  });
}
