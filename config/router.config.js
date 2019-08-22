export default [
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [{ path: '/login', component: './Login' }],
  },
  // 微信公众号
  {
    path: '/h5',
    component: '../layouts/WechatLayout',
    name: 'h5',
    routes: [
      {
        path: '/h5/user',
        name: 'user',
        routes: [
          // 绑定手机号
          {
            path: '/h5/user/bind',
            name: 'bind',
            component: './Wechat/User/BindPhone',
          },
          // 更好手机号
          {
            path: '/h5/user/change-phone',
            name: 'change-phone',
            component: './Wechat/User/ChangePhone',
          },
          // 更新手机号申诉
          {
            path: '/h5/user/appeal',
            name: 'appeal',
            component: './Wechat/User/Appeal',
          },
          // 用户主页
          {
            path: '/h5/user/center',
            name: 'center',
            component: './Wechat/User/center',
          },
          // 用户个人资料
          {
            path: '/h5/user/info',
            name: 'info',
            component: './Wechat/User/Info',
          },
          // 广告签约记录
          {
            path: '/h5/user/ad-signing',
            name: 'ad-signing',
            component: './Wechat/User/AdSigning',
          },
          {
            path: '/h5/user/ad-signing/:id',
            name: 'ad-signing-detail',
            component: './Wechat/User/AdSigningDetail',
          },
          // 广告结算记录
          {
            path: '/h5/user/ad-settlement',
            name: 'ad-settlement',
            component: './Wechat/User/AdSettlement',
          },
          // 乐蚁果兑换记录
          {
            path: '/h5/user/integral-exchange',
            name: 'integral-exchange',
            component: './Wechat/User/IntegralExchange',
          },
          // 等待页面
          {
            path: '/h5/user/waiting',
            name: 'waiting',
            component: './Wechat/User/Waiting',
          },
          // 用户注册
          {
            path: '/h5/user/register',
            name: 'register',
            component: './Wechat/User/Register',
          },
        ],
      },
      // 广告
      {
        path: '/h5/ads',
        name: 'ads',
        routes: [
          // 广告列表
          {
            path: '/h5/ads',
            name: 'list',
            component: './Wechat/AD/List',
          },
          // 广告详情
          {
            path: '/h5/ads/:id',
            name: 'detail',
            component: './Wechat/AD/Detail',
          },
          // 广告签约
          {
            path: '/h5/ads/:id/signing',
            name: 'signing',
            component: './Wechat/AD/Signing',
          },
        ],
      },
      // 活动
      {
        path: '/h5/activities',
        name: 'ads',
        routes: [
          // 活动列表
          {
            path: '/h5/activities',
            name: 'list',
            component: './Wechat/Activity/List',
          },
          // 活动详情
          {
            path: '/h5/activities/:id',
            name: 'detail',
            component: './Wechat/Activity/Detail',
          },
        ],
      },
      // 商品
      {
        path: '/h5/goods',
        name: 'goods',
        routes: [
          // 商品列表
          {
            path: '/h5/goods',
            name: 'list',
            component: './Wechat/Goods/List',
          },
          // 商品详情
          {
            path: '/h5/goods/:id',
            name: 'detail',
            component: './Wechat/Goods/Detail',
          },
        ],
      },
      {
        path: '/h5/home',
        name: 'home',
        component: './Wechat/Home/Index',
      },
    ],
  },
  {
    path: '/wechat/ad-signing-qrcode',
    name: 'ad-signing-qrcode',
    icon: 'qrcode',
    component: './AD/Paste/ScanQrcode',
    authority: ['admin'],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // 工作台
      { path: '/', redirect: '/redirect' },
      {
        path: '/redirect',
        name: 'workplace',
        hideInMenu: true,
        component: './Redirect',
      },
      // 商户工作台
      {
        path: '/index',
        name: 'business-workplace',
        icon: 'dashboard',
        component: './Workplace/Business',
        authority: ['business'],
      },
      {
        path: '/sele-mail-manager',
        name: 'sele-mail-manager',
        icon: 'dashboard',
        component: './Workplace/SeleMail',
        authority: ['business'],
      },
      // 管理员工作台
      {
        path: '/workplace',
        name: 'workplace',
        icon: 'dashboard',
        component: './Workplace/Workplace',
        authority: ['admin'],
      },
      {
        path: '/application',
        name: 'application',
        icon: 'audit',
        authority: ['admin'],
        routes: [
          // 用户审核
          {
            path: '/application/drivers',
            name: 'driver',
            // component: './User/Audit',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/application/drivers',
                name: 'list',
                component: './Driver/List',
              },
              {
                path: '/application/drivers/:id/audit',
                name: 'audit',
                component: './Driver/Audit',
              },
              {
                path: '/application/drivers/:id/update',
                name: 'audit',
                component: './Driver/Update',
              },
              {
                path: '/application/drivers/:id',
                name: 'info',
                component: './Driver/Info',
              },
            ],
          },
          // 申诉审核
          {
            path: '/application/appeals',
            name: 'appeal',
            component: './Driver/Appeal',
          },
          // 广告签约管理
          {
            path: '/application/ad-signings',
            name: 'ad-signing',
            hideChildrenInMenu: true,
            component: './AD/Layout',
            routes: [
              {
                path: '/application/ad-signings',
                redirect: '/application/ad-signings/paste',
              },
              {
                path: '/application/ad-signings/paste',
                name: 'paste',
                routes: [
                  {
                    path: '/application/ad-signings/paste',
                    component: './AD/Paste/List',
                  },
                  {
                    path: '/application/ad-signings/paste/detail',
                    name: 'detail',
                    component: './AD/Paste/Detail',
                  },
                ],
              },
              {
                path: '/application/ad-signings/settlement',
                name: 'settlement',
                routes: [
                  {
                    path: '/application/ad-signings/settlement',
                    component: './AD/Settlement/List',
                  },
                  {
                    path: '/application/ad-signings/settlement/detail',
                    name: 'detail',
                    component: './AD/Settlement/Detail',
                  },
                ],
              },
            ],
          },
          // 广告内容管理
          {
            path: '/application/ads',
            name: 'ad-content',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/application/ads',
                name: 'list',
                component: './AD/Content/List',
              },
              {
                path: '/application/ads/create',
                name: 'create',
                component: './AD/Content/Create',
              },
              {
                path: '/application/ads/:id/update',
                name: 'update',
                component: './AD/Content/Update',
              },
              {
                path: '/application/ads/:id',
                name: 'detail',
                component: './AD/Content/Detail',
              },
            ],
          },
          // 乐蚁果提现管理
          {
            path: '/application/integral/settlement',
            name: 'withdrawal',
            component: './Integral/Settlement',
          },
          // 活动内容管理
          {
            path: '/application/activities',
            name: 'activity',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/application/activities',
                name: 'list',
                component: './Activity/List',
              },
              {
                path: '/application/activities/create',
                name: 'create',
                component: './Activity/Create',
              },
              {
                path: '/application/activities/:id',
                name: 'detail',
                component: './Activity/Detail',
              },
              {
                path: '/application/activities/:id/update',
                name: 'update',
                component: './Activity/Update',
              },
            ],
          },
        ],
      },
      {
        path: '/integral',
        name: 'integral',
        icon: 'gift',
        authority: ['admin'],
        routes: [
          // 商户列表
          {
            path: '/integral/businesses',
            name: 'business',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/integral/businesses',
                name: 'list',
                component: './Business/List',
              },
              {
                path: '/integral/businesses/create',
                name: 'create',
                component: './Business/Create',
              },
              {
                path: '/integral/businesses/:id/update',
                name: 'create',
                component: './Business/Update',
              },
            ],
          },
          // 商品乐蚁果列表
          {
            path: '/integral/goods',
            name: 'goods',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/integral/goods',
                name: 'list',
                component: './Goods/List',
              },
              {
                path: '/integral/goods/create',
                name: 'create',
                component: './Goods/Create',
              },
              {
                path: '/integral/goods/:id/update',
                name: 'update',
                component: './Goods/Update',
              },
            ],
          },
        ],
      },
      {
        path: '/user',
        name: 'user',
        icon: 'team',
        authority: ['admin'],
        routes: [
          // 车主档案
          {
            path: '/user/drivers',
            name: 'driver',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/user/drivers',
                component: './Driver/Approved',
              },
              {
                path: '/user/drivers/:id/update',
                name: 'info',
                component: './Driver/Update',
              },
            ],
          },
          // 管理员
          {
            path: '/user/admins',
            name: 'admin',
            component: './Admin/List',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
