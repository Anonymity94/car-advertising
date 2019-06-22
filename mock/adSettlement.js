/**
 * 广告结算
 */

const content = {
  id: Math.random(),
  username: '用户名',
  phone: '138542345947',
  idcard: '23343423234234', // 身份证
  carType: '商务车', // 车辆类型
  carCode: '232433434', // 汽车行驶证
  expireTime: '2019-06-18', // 证件到期时间
  bonus: 2000, // 签约金

  // 签约有效期
  signingExpireTime: '2019-04-20', // 签约有效期 ? 有这个字段吗？

  pasteTime: '2019-06-19', // 粘贴日期
  pasteImages: [], // 操作人上传的照片,这里应该是有多张照片,也可以用字符串逗号分隔方式给出来
  pasteRemark: '', // 操作人填写的备注信息和拒绝原因

  settlementTime: '2019-06-19', // 结算日期
  settlementImage: [], // 结算时上传的图片
  settlementRemark: '', // 结算备注

  // 0- 未结算
  // 1- 已结算
  settlementState: '0', // 结算状态

  pastePerson: '测试', // 粘贴审核人
  settlementPerson: '测试', // 结算审核人
};

function mockList(req, res) {
  const list = [];
  for (let i = 0; i < 50; i += 1) {
    list.push({
      ...content,
      id: Math.random(),
      state: '0', // 粘贴情况
    });
  }

  return res.json(list);
}

export default {
  // 广告结算列表
  'GET /api/advertisements/settlements': mockList,
  // 广告结算详情
  'GET /api/advertisements/settlements?id=:id': content,
};
