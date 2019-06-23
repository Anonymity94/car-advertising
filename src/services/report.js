import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 一段时间内，每天的用户注册数量
 * @param {String} startTime
 * @param {String} endTime
 */
export async function countRegisterMetrics(params) {
  return request(`/api/report/users/register-metrics?${stringify(params)}`);
}

/**
 * 一段时间内的，每天的广告签约数量
 * @param {String} startTime
 * @param {String} endTime
 */
export async function countSigningMetrics(params) {
  return request(`/api/report/advertisemens/signing-metrics?${stringify(params)}`);
}

/**
 * 统计不同模块下的待处理事项
 */
export async function countTodos() {
  return request('/api/report/todo-metrics');
}
