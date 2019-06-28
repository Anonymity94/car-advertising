const content = {
  id: Math.random(),
  title: '活动标题',
  company: '活动主办方',
  banner: 'http://img1.imgtn.bdimg.com/it/u=3654433097,3499970316&fm=16&gp=0.jpg', // banner 图片
  activityTime: '2019-06-20', // 活动时间
  content: '活动内容', // 富文本
  participation: '参与方式', // 富文本
  publishTime: '2019-06-19 17:59:44', // 发布时间
  createTime: '2019-06-19 17:59:44', // 创建时间
  modifyTime: '2019-06-19 17:59:44', // 最近操作时间
  isTop: Math.random() > 0.5 ? '1' : '0', // 是否置顶
  isPublish: Math.random() > 0.5 ? '1' : '0', // 发布状态
  operator: '测试', // 操作人
  visitCount: 20, // 浏览数
  joinCount: 340, // 参与数
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
  'GET /api/activities': mockList,

  'GET /api/activities/:id': content,

  // 发布
  'POST /api/activities/:id': {},

  // 发布
  'POST /api/activities/:id/publish': {},

  // 置顶
  'POST /api/activities/:id/top': {},
};
