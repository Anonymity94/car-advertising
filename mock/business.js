const content = {
  id: Math.random(),
  name: '商户名称',
  contact: '联系人', // 联系人
  telephone: '18612133937', // 联系方式

  beginTime: '2019-06-04', // 开始提供日期
  endTime: '2015-09-12', // 截止提供时间

  goods: ['红星机油-红星油厂', '红星柴油-红星油厂'], // 提供的商品

  address: '活动内容', // 富文本
  createTime: '2019-06-19 17:59:44', // 创建时间
  modifyTime: '2019-06-19 17:59:44', // 最近操作时间
  operator: '测试', // 操作人
};

function mockList(req, res) {
  const params = req.query;
  const { page, pageSize } = params;

  const list = [];
  for (let i = 0; i < pageSize; i += 1) {
    list.push({
      ...content,
      id: Math.random(),
      isTop: Math.random() > 0.5 ? '1' : '0', // 是否置顶
      isPublish: Math.random() > 0.5 ? '1' : '0', // 发布状态
    });
  }

  return res.json({
    success: true,
    message: '',
    result: {
      content: list,
      number: page,
      size: pageSize,
      totalElements: list.length,
    },
  });
}

export default {
  'GET /api/businesses': mockList,

  'GET /api/businesses/:id': content,

  // 发布
  'POST /api/businesses/:id': {
    success: true,
  },
};
