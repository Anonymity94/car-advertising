const admins = [
  {
    id: Math.random(),
    name: '张全蛋111',
    username: 'liuwanru',
    password: 'aa3223',
  },
  {
    id: Math.random(),
    name: '张全蛋222',
    username: 'liuwanru',
    password: 'aa3223',
  },
  {
    id: Math.random(),
    name: '张全蛋333',
    username: 'liuwanru',
    password: 'aa3223',
  },
];

export default {
  'GET /api/user-manager/admin-list': admins,

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
