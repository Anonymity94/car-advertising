const content = {
  id: Math.random(),
  name: '张全蛋111',
  username: 'liuwanru',
  password: 'aa3223',
};

function mockList(req, res) {
  const list = [];
  for (let i = 0; i < 50; i += 1) {
    list.push({
      ...content,
      name: `张全蛋${i}`,
      id: Math.random(),
    });
  }

  return res.json(list);
}

export default {
  'GET /api/user-manager/admin-list': mockList,

  // 删除
  'POST /api/user-manager/admin-remove': {},

  // 更新
  'POST /api/user-manager/admin-update': {},

  // 增加
  'POST /api/user-manager/admin-register': {
    username: '新增成功',
    password: 'password',
  },
};
