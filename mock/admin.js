const admins = [
  {
    id: Math.random(),
    userName: 'liuwanru',
    password: '2323@13423',
    fullName: '张全蛋',
  },
  {
    id: Math.random(),
    userName: 'liuwanru',
    password: '2323@13423',
    fullName: '张全蛋',
  },
  {
    id: Math.random(),
    userName: 'liuwanru',
    password: '2323@13423',
    fullName: '张全蛋',
  },
];

export default {
  'GET /api/admins': {
    success: true,
    message: '',
    result: {
      content: admins,
      number: 0,
      size: admins.length,
      totalElements: 0,
    },
  },

  'POST /api/admins/:id/password': {
    success: true,
  },

  'POST /api/admins/:id': {
    success: true,
  },
};