const content = {
  id: Math.random(),
  name: '红星油厂',
  contact: '联系人', // 联系人
  telephone: '18612133937', // 联系方式

  beginTime: '2019-06-04', // 开始提供日期
  endTime: '2019-09-12', // 截止提供时间

  goods: '红星油厂-红星机油,红星油厂-红星柴油', // 提供的商品

  address: '活动内容', // 富文本
  createTime: '2019-06-19 17:59:44', // 创建时间
  modifyTime: '2019-06-19 17:59:44', // 最近操作时间
  operator: '测试', // 操作人
};

const allGoods = [
  {
    name: '轮胎',
    businessName: '红星油厂',
    endTime: '2019-09-12',
    address: '红星油厂地址',
  },
  {
    name: '耐克',
    businessName: 'NICK',
    endTime: '2019-08-12',
    address: '耐克地址',
  },
];

function mockList(req, res) {
  const list = [];
  for (let i = 0; i < 50; i += 1) {
    list.push({
      ...content,
      id: Math.random(),
      isTop: Math.random() > 0.5 ? '1' : '0', // 是否置顶
      isPublish: Math.random() > 0.5 ? '1' : '0', // 发布状态
    });
  }

  return res.json(list);
}

export default {
  'GET /api/businesses': mockList,

  'GET /api/businesses/all-goods': allGoods,

  'GET /api/businesses/:id': content,

  // 编辑
  'POST /api/businesses/:id': {},
  // 新建
  'POST /api/businesses': {},
};
