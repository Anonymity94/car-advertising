export default [
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [{ path: '/login', component: './Login' }],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // 工作台
      { path: '/', redirect: '/workplace' },
      {
        path: '/workplace',
        name: 'workplace',
        icon: 'dashboard',
        component: './Workplace/Workplace',
      },
      {
        path: '/application',
        name: 'application',
        icon: 'audit',
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
          // 粘贴广告
          {
            path: '/application/ad-signing',
            name: 'ad-signing',
            hideChildrenInMenu: true,
            component: './AD/Layout',
            routes: [
              {
                path: '/application/ad-signing',
                redirect: '/application/ad-signing/paste',
              },
              {
                path: '/application/ad-signing/paste',
                name: 'paste',
                component: './AD/Paste/List',
              },
              {
                path: '/application/ad-signing/settlement',
                name: 'settlement',
                component: './AD/Settlement/List',
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
                path: '/application/ads/:id',
                name: 'detail',
                component: './AD/Content/Detail',
              },
              {
                path: '/application/ads/:id/update',
                name: 'update',
                component: './AD/Content/Update',
              },
            ],
          },
          // 积分提现管理
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
          // 商品积分列表
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
                name: 'create',
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
