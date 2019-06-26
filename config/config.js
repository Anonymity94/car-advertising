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
        { src: '<%= PUBLIC_PATH %>libs/react.production-16.6.3.min.js' },
        { src: '<%= PUBLIC_PATH %>libs/react-dom.production-16.6.3.min.js' },
        { src: '<%= PUBLIC_PATH %>libs/react-router-dom-4.3.1.min.js' },
        { src: '<%= PUBLIC_PATH %>libs/data-set-0.96.min.js' },
        { src: '<%= PUBLIC_PATH %>libs/bizCharts-3.4.0.min.js' },
        { src: '<%= PUBLIC_PATH %>libs/moment-2.22.1.min.js' },
      ],
      title: '乐蚁车酷',
      metas: [{ charset: 'utf-8' }, { 'build-time': moment().format() }],
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        // webpackChunkName: true,
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
    IS_DEV: process.env.NODE_ENV === 'development',
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
      target: 'http://39.106.231.234',
      changeOrigin: true,
      pathRewrite: { '^/mock-api': '' },
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
