const drivers = [
  {
    id: Math.random(),
    name: '刘婉茹',
    telephone: '138542345947',
    identityCard: '23343423234234', // 身份证
    createTime: '2019-06-18T20:30:57+08:00',
    state: '0',
    operatorName: '',
  },
  {
    id: Math.random(),
    name: '刘婉茹',
    telephone: '138542345947',
    identityCard: '23343423234234', // 身份证
    createTime: '2019-06-18T20:12:13Z',
    state: 1,
    operatorName: '管理员',
  },
  {
    id: Math.random(),
    name: '刘婉茹',
    telephone: '138542345947',
    identityCard: '23343423234234', // 身份证
    createTime: '2019-06-18T20:12:13Z',
    state: 2,
    operatorName: '管理员',
  },
];

export default {
  'GET /api/drivers': {
    success: true,
    message: '',
    result: {
      content: drivers,
      number: 0,
      size: 15,
      totalElements: 0,
    },
  },

  'GET /api/drivers/:id': {
    success: true,
    message: '',
    result: {
      id: '232323',
      name: '刘婉茹',
      telephone: '138542345947',
      identityCard: '23343423234234', // 身份证
      identityCardImage1: '1212', // 身份证国徽照
      identityCardImage2: '1212', // 身份证人脸照
      carType: '商务车', // 车辆类型
      drivingPermit: '232433434', // 汽车行驶证
      drivingPermitDueTime: '2019-06-18', // 汽车行驶证到期时间
      drivingPermitImage: '/2334/233434', // 行驶证照片
      carImgae: '', // 汽车照片
      driverLicenseImage: '', // 驾驶证照片
    },
  },

  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === 'ant.design' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === 'ant.design' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};
