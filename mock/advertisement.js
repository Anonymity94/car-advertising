const adContent = {
  id: Math.random(),
  title: '广告名称广告名称广告名称广',
  company: '所属公司机构',
  banner: 'https://img.zcool.cn/community/01c22b5b596b74a801206a35e43a5e.png@1280w_1l_2o_100sh.png', // banner 图片
  cover: ['https://pic4.zhimg.com/v2-4e1c5559fff9909b56c2573a79570e3a_1200x500.jpg'], // 列表图片
  clause: '/12/234/2323.pdf', // 签约条款的 pdf 文件路径
  bonus: 1000, // 签约金, xxx/月
  integral: 20, // 积分
  content: '广告内容', // 内容
  remark: '积分备注', // 积分备注
  address: [
    {
      address: '北京市海淀区',
      beginTime: '2019-06-19',
      endTime: '2019-07-19',
    },
    {
      address: '北京市海淀区',
      beginTime: '2019-06-19',
      endTime: '2019-07-19',
    },
  ],
  publishTime: '2019-06-19 17:59:44', // 发布时间
  createTime: '2019-06-19 17:59:44', // 创建时间
  modifyTime: '2019-06-19 17:59:44', // 最近操作时间
  isTop: Math.random() > 0.5 ? 1 : 0, // 是否置顶
  isPublish: Math.random() > 0.5 ? 1 : 0, // 发布状态
  operator: '测试', // 操作人
  visitCount: 20, // 浏览数
  signingCount: 340, // 签约数
};

function mockAdsList(req, res) {
  const list = [];
  for (let i = 0; i < 50; i += 1) {
    list.push({
      ...adContent,
      id: Math.random(),
      isTop: 0, // 是否置顶
      isPublish: Math.random() > 0.5 ? 1 : 0, // 发布状态
    });
  }

  list[3].isTop = 1;
  list[3].title = '广告名称广告名称广告名称广告名称广告名称广告名称广告名称';

  list[1].title = '广告名称广告名称广告名称广告名称广告名称广告名称广告名称广告名称广告名称广告名称广告名称广告名称广告名称广告名称广告名称广告名称广告名称广告名称广告名称广告名称广告名称';
  
  list[13].isTop = 1;
  list[23].isTop = 1;

  return res.json(list);
}

export default {
  'GET /api/ads': mockAdsList,

  'GET /api/ads/:id': adContent,

  // 发布广告
  'POST /api/ads/:id': {},

  // 发布广告
  'POST /api/ads/:id/publish': {},

  // 置顶广告
  'POST /api/ads/:id/top': {},

  // 广告粘贴列表
  'GET /api/ads/pastes': mockAdsList,
};
