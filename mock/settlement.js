/**
 * 积分提现管理
 */

const content = {
  id: Math.random(),
  username: '张三',
  integral: 20, // 积分数
  money: 2323, // 金额
  telephone: '18366133937',
  settlementTime: '2019-06-22', // 结算日期
  state: 0, // 结算状态
  operator: '测试', // 操作人
};

function mockList(req, res) {
  const list = [];
  for (let i = 0; i < 50; i += 1) {
    list.push({
      ...content,
      id: Math.random(),
      state: Math.random() > 0.5 ? '1' : '0', // 是否结算
    });
  }

  return res.json(list);
}

export default {
  // 查询所有结算记录（未结算、已结算）
  // 前台根据 state 这个标志来区分是否已结算
  'GET /api/integrals/settlement': mockList,

  // 结算
  'POST /api/integrals/settlement?id=:id': {},
};
