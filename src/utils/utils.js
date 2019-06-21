import React from 'react';
import { parse, stringify } from 'qs';
import router from 'umi/router';

/**
 * 补充0
 * @param {Number} val
 */
export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

/**
 * 手机号码正则
 */
export const phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;

/**
 * 密码正则
 * 密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)
 */
export const passwordReg = /^[a-zA-Z][a-zA-Z0-9-_]{5,17}$/;

/**
 * 身份证号码正则
 */
export const idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

export function handlePageRefresh(newQuery) {
  const {
    location: { query, pathname },
  } = this.props;
  router.push({
    pathname,
    search: stringify({
      ...query,
      ...newQuery,
    }),
  });
}

export function handleSearchReset() {
  const { form } = this.props;
  const { getFieldsValue, setFieldsValue } = form;

  const fields = getFieldsValue();
  // eslint-disable-next-line no-restricted-syntax
  for (const item in fields) {
    if ({}.hasOwnProperty.call(fields, item)) {
      if (fields[item] instanceof Array) {
        fields[item] = [];
      } else {
        fields[item] = '';
      }
    }
  }
  // 刷新表单数据
  setFieldsValue(fields);

  this.handlePageRefresh({
    ...fields,
    page: 1,
  });
}

// 表格分页变动等
export function handleTableChange(pagination, filters, sorter) {
  this.handlePageRefresh({
    page: pagination.pageNumber,
    pageSize: pagination.pageSize,
  });
}
