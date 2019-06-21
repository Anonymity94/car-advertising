const appeals = [
  {
    id: Math.random(),
    name: '刘婉茹',
    oldTelephone: '138542345947',
    telephone: '138542345947',
    createTime: '2019-06-18T20:30:57+08:00',
    description: '手机丢了，换了新手机号',
    state: '0',
    stateText: '未审核',
    operatorName: '',
  },
  {
    id: Math.random(),
    oldTelephone: '138542345947',
    telephone: '138542345947',
    createTime: '2019-06-18T20:30:57+08:00',
    description: '手机丢了，换了新手机号',
    state: '1',
    stateText: '已通过',
    operatorName: '管理员',
  },
  {
    id: Math.random(),
    oldTelephone: '138542345947',
    telephone: '138542345947',
    createTime: '2019-06-18T20:30:57+08:00',
    description: '手机丢了，换了新手机号',
    state: '-1',
    stateText: '未通过',
    operatorName: '管理员',
  },
];

export default {
  'GET /api/appeals': {
    content: appeals,
    number: 0,
    size: 15,
    totalElements: 0,
  },

  'POST /api/appeals/:id/state': {},
};
