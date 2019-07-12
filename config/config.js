// https://umijs.org/config/
import os from 'os';
import slash from 'slash2';
import moment from 'moment';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      // @see: https://github.com/umijs/umi/issues/1086
      // PUBLIC_PATH 对应 publicPath
      headScripts: [
        { src: 'https://lib.baomitu.com/react/16.6.3/umd/react.production.min.js' },
        { src: 'https://lib.baomitu.com/react-dom/16.6.3/umd/react-dom.production.min.js' },
        { src: 'https://lib.baomitu.com/react-router-dom/4.3.1/react-router-dom.min.js' },
        { src: '//gw.alipayobjects.com/os/lib/antv/data-set/0.10.1/dist/data-set.min.js' },
        { src: '//gw.alipayobjects.com/os/lib/bizcharts/3.4.3/umd/BizCharts.min.js' },
        { src: 'https://lib.baomitu.com/moment.js/2.22.1/moment.min.js' },
      ],
      title: '乐蚁车酷',
      fastClick: true,
      metas: [{ charset: 'utf-8' }, { 'build-time': moment().format() }],
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        // webpackChunkName: true,
        level: 3,
      },
      ...(!process.env.TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: false,
          }
        : {}),
    },
  ],
];

export default {
  // add for transfer to umi
  plugins,
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
    IS_DEV: process.env.IS_DEV || process.env.NODE_ENV === 'development',
  },
  treeShaking: true,
  targets: {
    ie: 11,
  },
  hash: true, // 开启文件hash
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    'brand-primary': 'rgb(0, 199, 189)'
  },
  externals: {
    '@antv/data-set': 'DataSet',
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-router-dom': 'ReactRouterDOM',
    bizcharts: 'BizCharts',
    moment: 'moment',
  },
  proxy: {
    '/mock-api/': {
      target: 'https://testzyy.limitouch.com',
      changeOrigin: true,
      pathRewrite: { '^/mock-api': '' },
    },
    '/upload/': {
      target: 'https://testzyy.limitouch.com',
      changeOrigin: true,
      pathRewrite: { '^/upload': '/upload' },
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {},
  manifest: {
    basePath: '/',
  },

  // chainWebpack: webpackPlugin,
};
