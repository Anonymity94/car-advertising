import request from '@/utils/request';

/**
 * 根据兑换码，查询兑换详情
 * @param {String} exchangeCode
 */
export async function queryExchangeDetail({ exchangeCode }) {
  return request(`/api/goods/exchange/detail?exchangeCode=${exchangeCode}`, {
    method: 'GET',
  });
}

/**
 * 查询某个商户下所有的商品兑换日志
 * @param {String} businessId
 */
export async function queryExchangeLogs({ businessId }) {
  return request(`/api/goods/exchange/logs?businessId=${businessId}`, {
    method: 'GET',
  });
}

/**
 * 通过某个兑换申请
 * @param {String} exchangeCode
 */
export async function auditExchange({ exchangeCode }) {
  return request(`/api/goods/exchange/access`, {
    method: 'POST',
    body: {
      exchangeCode,
    },
  });
}
