/* eslint-disable no-param-reassign */
import moment from 'moment';

const countRegisterMetrics = [];
const countSigningMetrics = [];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // 含最大值，含最小值
}

for (let i = 0; i < 7; i += 1) {
  const date = moment()
    .subtract(i, 'days')
    .format('MM-DD');

  countRegisterMetrics.unshift({
    x: date,
    y: getRandomIntInclusive(2, 100),
  });

  countSigningMetrics.unshift({
    x: date,
    y: getRandomIntInclusive(2, 100),
  });
}

const countTodos = [
  {
    module: 'ad-signing',
    name: '广告签约管理', // name 可以不返回
    count: 4,
  },
  {
    module: 'user-verify',
    name: '用户审核管理', // name 可以不返回
    count: 5,
  },
  {
    module: 'user-appeal',
    name: '用户申诉管理', // name 可以不返回
    count: 23,
  },
  {
    module: 'integral-settlement',
    name: '积分体现管理管理', // name 可以不返回
    count: 34,
  },
];

export default {
  'GET /api/report/users/register-metrics': countRegisterMetrics,
  'GET /api/report/advertisemens/signing-metrics': countSigningMetrics,
  'GET /api/report/todo-metrics': countTodos,
};
