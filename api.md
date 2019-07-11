## 检查登录的微信用户，某个活动的参与情况
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


## 检查登录的微信用户，某个商品的兑换情况
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
 GET /api/ad-signings/user
 
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
 GET /api/ad-signings/user-settle
 
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
 GET /api/integrals/user
 
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


## 后台：查询所有申诉

```
GET /api/appeals

参数：
{
  name: '', // 用户名称
  createTime: '', // 用户提交日期
  state: '', // 申诉的状态
}

返回值：
[
  {
    id: Math.random(),
    name: '刘婉茹', 
    oldPhone: '138542345947',
    phone: '138542345947',
    createTime: '2019-06-18T20:30:57+08:00',
    description: '手机丢了，换了新手机号',
    state: '0',
    stateText: '未审核',
    operator: '',
  }
]

```
## 后台：申诉审核

```
PUT /api/appeals/{id}/state

body参数：
{
  remark: '', // 管理员同意或拒绝的备注 
  state: '', // 申诉的状态
}


```

## 微信端用户提交申诉
```
POST /api/appeals

body 参数
{
  openid: '' , // 用户有可能登录失效了，然后跳转到绑定页面，这时候以前的手机换掉了，所以需要 openid 来找到以前的用户
  oldPhone: '', // 老的手机号
  phone: '', // 新的手机号
  captcha: '', // 新手机号接收的验证码
}

```

---
# 2019-07-06 缺失汇总
---

## 微信端注册用户，404
```
POST /api/user/register

body 参数
{
	"username": "测试人员",
	"phone": "18366133937",
	"idcard": "371321199502163598",
	"idardBackImage": "/upload/7e895df8-a2d5-4f13-8689-2d07fdddaed9.jpg", #身份证人像面
	"idardFrontImage": "/upload/18b3056b-3c3b-45d4-b38e-62a8071cf9e3.jpeg", #身份证国徽面
	"carCodeImage": "/upload/3d619d26-c857-41ee-914f-572eb925ee3f.jpeg", #行驶证照片
	"driverLicenseImage": "/upload/e5f0f92f-2877-4113-a6a9-078026b302a2.jpg", #驾驶证照片

  "carType": '小型汽车',
  "carCode": '23232323', # 行驶证号
  "expireTime": '2019-07-06', # 车辆到期时间，也就是行驶证到期时间
	"carImage": "/upload/11124e10-f43e-4eae-8d31-7b49f50ddae9.jpeg"
}

```
## 申诉审核管理，缺失字段
```
GET /api/appeals 

返回字段缺少 
reason 申诉理由
createTime 申诉提交时间
state 状态，返回的是字符串？需要统一一下，状态类的，返回的字符串还是数字

```

## 申诉审核管理，返回200状态，但是审核未生效
```
PUT /api/appeals/5d2047d53a20860006d07c5c/state

不通过时，没有生效

body
{
remark: "232323"
state: 2
}

```

## 后台管理：新增广告和编辑广告

签约有效期 signingExpireTime 保存失败
营业开始时间beginTime 保存失败

## 广告详情接口  blocked
```
/api/ads/5d11b8ce2ddcfe000621b32d (blocked:other)
```


## 获取验证码 405
```
/api/captcha?phone=18612133937
```


## 用户审核
```
/api/user-manager/user-manager/user-access?id=5d20cb84caec620007d0fbce
你多嵌套了一层 /user-manager

--- 

用户审核，返回了200 状态码，但是status没有修改
/api/user-manager/user-manager/user-access
/api/user-manager/user-manager/user-reject

现在拒绝好像也是通过了~~~

```

## 讨论一个问题，微信端个人信息。

需要2个接口，一个是查当前登录人的详情信息。
和 后台管理`/api/user-manager/user-single?id=${id}`  返回一模一样

第二个是，修改个人信息，`/api/user-manager/user-manager/user-update?id=${id}` 这个也能复用


但是id，怎么处理
