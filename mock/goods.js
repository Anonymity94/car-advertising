const content = {
  id: Math.random(),
  name: '商品名称',
  businessName: '所属商户名称',
  endTime: '2019-06-04', // 到期时间
  integral: 20, // 商品积分

  image: '223/3434/4545.jpg', // 商品头图，小图
  shopImage: '', // 商城页片，大图

  address: '地址',

  content: '商品详情内容',

  createTime: '2019-06-19 17:59:44', // 创建时间
  publishTime: '2019-06-19 17:59:44', // 发布时间
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
    content: list,
    number: page,
    size: pageSize,
    totalElements: list.length,
  });
}

export default {
  'GET /api/goods': mockList,

  'GET /api/goods/:id': content,

  // 编辑
  'POST /api/goods/:id': {},
  // 新建
  'POST /api/goods': {},
};
