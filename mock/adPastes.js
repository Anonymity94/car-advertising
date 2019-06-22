/**
 * 广告粘贴管理
 */

const content = {
  id: Math.random(),
  userId: '232323',
  fullname: '用户名',
  phone: '138542345947',
  idcard: '23343423234234', // 身份证
  carType: '商务车', // 车辆类型
  carCode: '232433434', // 汽车行驶证
  expireTime: '2019-06-18', // 证件到期时间
  bonus: 2000, // 签约金

  // 签约有效期
  signingExpireTime: '2019-04-20', // 签约有效期 ? 有这个字段吗？

  pasteTime: '2019-06-19', // 粘贴日期

  // 0- 未审核。前端用户签约成功后，生成二维码,后台没有扫码之前，一直是未审核状态
  // 1- 待粘贴。后台扫码后，变成未粘贴状态
  // 2- 已粘贴。后台扫码后，点击粘贴按钮，上传图片和备注，变成已粘贴状态
  // 3- 拒绝。后台扫码后，点击拒绝按钮，上传图片和原因，变成拒绝状态
  pasteState: '0', // 粘贴情况

  pasteImages: [], // 操作人上传的照片,这里应该是有多张照片,也可以用字符串逗号分隔方式给出来
  pasteRemark: '', // 操作人填写的备注信息和拒绝原因

  pastePerson: '测试', // 粘贴审核人
  settlementPerson: '', // 结算审核人
};

function mockList(req, res) {
  const list = [];
  for (let i = 0; i < 50; i += 1) {
    list.push({
      ...content,
      id: Math.random(),
      pasteState: '0', // 粘贴情况
    });
  }

  return res.json(list);
}

export default {
  // 广告粘贴列表
  'GET /api/advertisement-signings/pastes': mockList,

  // 粘贴广告
  // body 参数
  // {pasteImages: [], pasteRemark: 'xxxx'}
  'POST /api/advertisementssignings/access-paste?id=:id': {},

  // 拒绝
  // body 参数
  // {pasteImages: [], pasteRemark: 'xxxx'}
  'POST /api/advertisement-signings/reject-paste?id=:id': {},
};
