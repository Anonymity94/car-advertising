import fetch from 'dva/fetch';
import { notification } from 'antd';
import { MOCK_API_PREFIX } from '@/common/app';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const isWechatPage = window.location.href.indexOf('/h5/') > -1;

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const errortext = codeMessage[response.status] || response.statusText;

  // 微信端不提示
  if (!isWechatPage) {
    notification.error({
      message: `请求错误 ${response.status}: ${response.url}`,
      description: errortext,
    });
  }

  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  console.log('error', error);
  throw error;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  // eslint-disable-next-line no-param-reassign
  url = IS_DEV ? `${MOCK_API_PREFIX}${url}` : url;

  const options = {
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */

  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (!contentType) return response;
      if (contentType.includes('application/json')) {
        return response.json();
      }
      if (contentType.includes('text/plain')) {
        return response.text();
      }
      return response;
    })
    .then(result => ({
      success: true,
      result,
    }))
    .catch(e => {
      console.log(e);
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        // window.g_app._store.dispatch({
        //   type: 'login/logout',
        // });
      } else if ((status <= 504 && status >= 500) || (status >= 404 && status < 422)) {
      }
      return {
        success: false,
      };
    });
}
