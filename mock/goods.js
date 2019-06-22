/**
 * 商品积分管理
 */
const content = {
  id: Math.random(),
  name: '商品名称',
  businessName: '所属商户名称',
  endTime: '2019-06-04', // 到期时间
  integral: 20, // 商品积分

  image: '223/3434/4545.jpg', // 商品头图，小图
  shopImage: '', // 商城页片，大图

  address: '地址',

  content: '商品详情内容', // 富文本

  isTop: Math.random() > 0.5 ? '1' : '0', // 是否置顶
  isPublish: Math.random() > 0.5 ? '1' : '0', // 发布状态

  createTime: '2019-06-19 17:59:44', // 创建时间
  publishTime: '2019-06-19 17:59:44', // 发布时间
  modifyTime: '2019-06-19 17:59:44', // 最近操作时间
  operator: '测试', // 操作人
};

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
  // 所有商品列表
  'GET /api/goods': mockList,

  // 商品详情
  'GET /api/goods/:id': content,

  // 编辑
  'PUT /api/goods/:id': {},
  // 新建
  'POST /api/goods': {},

  // 发布商品
  // 参数：isPublish
  'PUT /api/goods/:id/publish': {},

  // 置顶商品
  // 参数：isTop
  'PUT /api/goods/:id/top': {},
};
