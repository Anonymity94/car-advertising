const drivers = [
  {
    id: Math.random(),
    name: '刘婉茹',
    phone: '138542345947',
    idcard: '23343423234234', // 身份证
    createTime: '2019-06-18T20:30:57+08:00',
    carType: '商务车', // 车辆类型
    carCode: '232433434', // 汽车行驶证
    expireTime: '2019-06-18', // 汽车行驶证到期时间
    state: '0',
    stateText: '未审核',
    verifyName: '',
  },
  {
    id: Math.random(),
    name: '刘婉茹',
    phone: '138542345947',
    idcard: '23343423234234', // 身份证
    createTime: '2019-06-18T20:30:57+08:00',
    carType: '商务车', // 车辆类型
    carCode: '232433434', // 汽车行驶证
    expireTime: '2019-06-18', // 汽车行驶证到期时间
    state: 1,
    stateText: '已通过',
    verifyName: '管理员',
  },
  {
    id: Math.random(),
    name: '刘婉茹',
    phone: '138542345947',
    idcard: '23343423234234', // 身份证
    createTime: '2019-06-18T20:30:57+08:00',
    carType: '商务车', // 车辆类型
    carCode: '232433434', // 汽车行驶证
    expireTime: '2019-06-18', // 汽车行驶证到期时间
    state: -1,
    stateText: '未通过',
    verifyName: '管理员',
  },
];

export default {
  'GET /api/user-manager/user-list': drivers,

  'GET /api/user-manager/user-single?id=2323': {
    id: '232323',
    name: '刘婉茹',
    state: '0',
    telephone: '138542345947',
    idcard: '23343423234234', // 身份证
    identityCardImage1:
      'http://t11.baidu.com/it/u=1856743291,913193672&fm=173&app=25&f=JPEG?w=500&h=325&s=4E53CF121D564CC85AE9B1CB010050B1', // 身份证国徽照
    identityCardImage2:
      'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2384163257,1795060609&fm=173&app=49&f=JPEG?w=640&h=429&s=00114F30075665C8087940C80300F0B2', // 身份证人脸照
    carType: '商务车', // 车辆类型
    carCode: '232433434', // 汽车行驶证
    expireTime: '2019-06-18', // 汽车行驶证到期时间
    drivingPermitImage:
      'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3871765756,3947697558&fm=26&gp=0.jpg', // 行驶证照片
    carImgae:
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1561476287&di=d8f4fa94c2dcd7b29d8491211d966e7f&imgtype=jpg&er=1&src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F17%2F09%2F25%2F163bc7fcf0cee0a4f87a2a50be45471c.jpg', // 汽车照片
    driverLicenseImage:
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560881541759&di=5e068feaa5e8f28e30b7e329ab77eb7c&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_70%2Cc_zoom%2Cw_640%2Fimages%2F20181210%2F008382543e594c6a888098892d615ce9.jpeg', // 驾驶证照片
  },
  'POST /api/drivers/:id/state': {},

  'POST /api/user-manager/user-update?id=:id': {},

  'POST /api/user-manager/user-remove?id=:id': {},
};
