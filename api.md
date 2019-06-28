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
