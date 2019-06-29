## 检查登陆的微信用户，某个活动的参与情况
```
GET /api/activities/${id}/check-join

参数：id -活动id

返回值： true -已经参与过   false -没有参与过
```


## 用户参与某个活动
```
POST /api/activities/${id}

参数：id -活动id
```


## 检查登陆的微信用户，某个商品的兑换情况
```
GET /api/goods/${id}/check-exchange

参数：id -商品id

返回值： true -已经兑换过   false -没有兑换过
```

## 兑换商品
```
POST /api/goods/${id}/exchange

参数：id -商品id
```

## 新增页面

- 广告列表：testzyy.limitouch.com/h5/ads
- 活动列表：testzyy.limitouch.com/h5/activities
- 积分商城：testzyy.limitouch.com/h5/goods


## 微信端：我的签约记录
```
 GET /api/user/ad-signings
 
 参数：无

 返回值：
[
  {
  id: Math.random(),// 签约记录id

  adId: '23233', // 广告id，需要跳转到广告详情页使用
  adTitle: '车载产品的使用一般需通过车载慰问慰问', // 广告标题
  bonus: 2000, // 签约金

  createTime: '2019-04-20 23:34:12', // 签约提交时间

  address: '北京海淀区',
  beginTime: '08:00',
  endTime: '12:30', // 营业时间

  // 签约有效期
  signingExpireTime: '2019-04-20',

  qrcode: 'http://www.transfu.com/uploads/image/20181227/1545897613591851.jpg', // 签约二维码图片地址或者base64都可以

  // 0- 未结算
  // 1- 已结算
  settlementState: 0, // 结算状态
}
]

```

## 微信端：我的结算记录
```
 GET /api/user/ad-settlements
 
 参数：无

 返回值：
[
  {
  id: Math.random(), // 签约记录id

  adId: '23233', // 广告id，需要跳转到广告详情页使用
  adTitle: '车载产品的使用一般需通过车载慰问慰问', // 广告标题
  bonus: 2000, // 签约金

  createTime: '2019-04-20 23:34:12', // 签约提交时间

  address: '北京海淀区',
  beginTime: '08:00',
  endTime: '12:30', // 营业时间

  // 签约有效期
  signingExpireTime: '2019-04-20',

  qrcode: 'http://www.transfu.com/uploads/image/20181227/1545897613591851.jpg', // 签约二维码图片地址或者base64都可以

  // 0- 未结算
  // 1- 已结算
  settlementState: 0, // 结算状态
  settlementTime: '2019-04-20 23:34:12', // 结算时间
}
]
```

## 微信端：我的积分兑换记录
```
 GET /api/user/integral-exchanges
 
 参数：无

 返回值：
{
  id: Math.random(), // 兑换记录id
  integral: 20, // 所需积分数

  createTime: '2019-06-22', // 用户提交兑换的时间

  exchangeCode: 34343434, // 兑换码

  goodsName: 'iPhone X', // 商品名称
  businessName: '苹果公司', // 所属商户

  settlementTime: '2019-06-22', // 结算日期
  state: 0, // 兑换状态
  operator: '测试', // 操作人
}
```
