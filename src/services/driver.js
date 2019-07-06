/**
 * 用户管理
 */

import { stringify } from 'qs';
import request from '@/utils/request';
import { AUDIT_STATE_PASSED } from '@/common/constants';

/**
 * 查询注册车主列表
 */
export async function queryDrivers() {
  return request('/api/user-manager/user-list');
}

/**
 * 查询已通过的车主列表
 * @param {*} params
 */
export async function queryApprovedDrivers(params) {
  return request(`/api/drivers?${stringify({ ...params, state: AUDIT_STATE_PASSED })}`);
}

/**
 * 查询车主详情
 * @param {String} id
 */
export async function queryDriverById({ id }) {
  return request(`/api/user-manager/user-single?id=${id}`);
}

/**
 * 用户审核
 * @param {String} id
 * @param {String} state
 * @param {String} reason
 */
export async function auditDriver({ id, status, reason = '' }) {
  const api = status === AUDIT_STATE_PASSED ? 'user-access' : 'user-reject';
  return request(`/api/user-manager/user-manager/${api}?id=${id}`, {
    method: 'PUT',
    body: {
      reason,
    },
  });
}

/**
 * 更新行驶证的到期时间
 * @param {Stirng} id 用户id
 * @param {Stirng} expireTime  行驶证的到期日期
 */
export async function updateDriver({ id, ...reset }) {
  return request(`/api/user-manager/user-manager/user-update?id=${id}`, {
    method: 'PUT',
    body: {
      ...reset,
    },
  });
}

/**
 * 删除
 * @param {String} id
 */
export async function deleteDriver({ id }) {
  return request(`/api/user-manager/user-remove?id=${id}`, {
    method: 'DELETE',
    body: {},
  });
}

/**
 * 获取验证码
 */
export async function getCaptcha({ phone }) {
  return request(`/api/captcha?phone=${phone}`);
}

/**
 * 用户注册
 */
export async function register(params) {
  return request('/api/user/register', {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 微信端：绑定手机号
 * @param {String} phone
 * @param {String} captcha
 */
export async function bindPhone(params) {
  return request('/api/user/bind', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 微信端：更换手机号
 */
export async function changePhone(params) {
  return request('/api/user/change-phone', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 微信端：我的签约记录
 */
export async function queryUserSignings() {
  return request('/api/ad-signings/user');
}

/**
 * 微信端：我的结算记录
 */
export async function queryUserSettlements() {
  return request('/api/ad-signings/user-settle');
}

/**
 * 微信端：我的积分兑换记录
 */
export async function queryUserExchanges() {
  return request('/api/integrals/user');
}
