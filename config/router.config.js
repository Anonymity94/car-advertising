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
                path: '/application/drivers/:id/info',
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
            path: '/application/ad-content',
            name: 'ad-content',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/application/ad-content',
                name: 'list',
                component: './AD/Content/List',
              },
              {
                path: '/application/ad-content/detail',
                name: 'detail',
                component: './AD/Content/Detail',
              },
              {
                path: '/application/ad-content/create',
                name: 'create',
                component: './AD/Content/Create',
              },
              {
                path: '/application/ad-content/update',
                name: 'update',
                component: './AD/Content/Update',
              },
            ],
          },
          // 积分提现管理
          {
            path: '/application/integral/withdrawal',
            name: 'withdrawal',
            component: './Integral/Withdrawal',
          },
          // 活动内容管理
          {
            path: '/application/activity',
            name: 'activity',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/application/activity',
                name: 'list',
                component: './Activity/List',
              },
              {
                path: '/application/activity/detail',
                name: 'detail',
                component: './Activity/Detail',
              },
              {
                path: '/application/activity/create',
                name: 'create',
                component: './Activity/Create',
              },
              {
                path: '/application/activity/update',
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
            path: '/integral/business',
            name: 'business',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/integral/business',
                name: 'list',
                component: './Business/List',
              },
              {
                path: '/integral/business/create',
                name: 'create',
                component: './Business/Create',
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
                component: './Integral/Goods',
              },
              {
                path: '/integral/goods/create',
                name: 'create',
                component: './Integral/Create',
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
                component: './Driver/Audited',
              },
              {
                path: '/user/drivers/:id',
                name: 'info',
                component: './Driver/Info',
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
