> 2019年06月24日 联调问题备忘

## 活动内容管理

- 最近操作时间、发布时间、操作人、参与数、浏览数，没有初始值。
- 置顶接口 `/activities/{id}/top` 404。应该是版本的问题。
- 注意排序：先置顶，再发布，最后未发布。每一类中，按时间倒序。


## 广告内容管理

- 增加字段，签约有效期，`signingExpireTime`.
- 新增广告 `/api/api/advertisements` 404。应该是版本的问题。
- 注意排序：先置顶，再发布，最后未发布。每一类中，按时间倒序。

- 更新、置顶、删除、发布 还没有测试。



进度汇报：

1. https 已经部署完成
2. 微信端已经基本打通。但是存在下面2个小问题
   ① 微信通知，现在无法使用，需要后台申请消息模版。我们本地开发环境已经测好，需要等模版就位，所以目前隐藏了。
   ② 微信目前使用的是测试公众号，因为需要后台填写一个可信任的域。
3. 后台用户：用户名密码都是admin
4. 商户用户：
   登录名：大润发
   密码：a123456



如果要演示微信端，可以参考下面几个地址

用户注册：https://testzyy.limitouch.com/h5/user/register
用户主页：https://testzyy.limitouch.com/h5/user/center
广告列表：https://testzyy.limitouch.com/h5/ads
活动列表：https://testzyy.limitouch.com/h5/activities
积分商城：https://testzyy.limitouch.com/h5/goods


我们这周末会持续更新，继续整理微信端。

如果有问题，及时联系，我们及时处理。

以上。



## 测试问题

1. 排查下，涉及到填写验证码的地方，后台应该是都没校验。
    例如，用户申诉、用户注册时。我填写了一个错误的手机验证码，也可以成功。

2. 用户申诉审核，列表，
  通过，不生效。PUT /api/appeals/5d29833bc069360006e0db55/state  {state: 1}
  不通过，不生效。PUT /api/appeals/5d29833bc069360006e0db55/state  {state: 2，ramark: '不通过'}

3. 查某个商品详情时，/api/goods/5d29922234b86b00063f0d70 
  缺少了2个字段：address：商户的地址，endTime：到期时间。
  这2个字段都是商户的信息。

4. 查商品列表/api/goods，问题同3


this.mongo.upsert(new Query(Criteria.where("_id").is(id)), u, AppealsEntity.class);

this.mongoTemplate.upsert(new Query(Criteria.where("_id").is(id)), Update.update("status", 1), WechatAccountEntity.class);
