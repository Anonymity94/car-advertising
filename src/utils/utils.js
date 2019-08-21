import React, { Fragment } from 'react';
import lodash from 'lodash';
import { parse, stringify } from 'qs';
import { Toast } from 'antd-mobile';
import router from 'umi/router';
import moment from 'moment';

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
 * @see: https://www.cnblogs.com/xtqg0304/p/9529721.html
 */
export const idcardReg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;

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

export function handleSearch(e) {
  if (e) e.preventDefault();
  const { form } = this.props;
  form.validateFields((err, fieldsValue) => {
    if (err) return;

    const values = {};
    Object.keys(fieldsValue).map(key => {
      values[key] = moment.isMoment(fieldsValue[key])
        ? moment(fieldsValue[key]).format('YYYY-MM-DD')
        : fieldsValue[key];
    });

    this.setState(
      {
        search: {
          ...values,
        },
      },
      () => {
        this.handleFilterResult();
      }
    );
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
        fields[item] = undefined;
      }
    }
  }
  // 刷新表单数据
  setFieldsValue(fields);
  this.handleSearch();
}

// 表格分页变动等
export function handleTableChange(pagination, filters, sorter) {
  this.handlePageRefresh({
    page: pagination.pageNumber,
    pageSize: pagination.pageSize,
  });
}

export function handleFilterResult() {
  const { search } = this.state;
  const { list } = this.props;

  let result = list.slice();

  // eslint-disable-next-line compat/compat
  const values = Object.values(search).map(item => {
    if (item === 0) {
      return '0';
    }
    return item;
  });
  // 过滤掉空值
  const compactValues = lodash.compact(values);
  if (compactValues.length > 0) {
    // 所有的搜关键字
    const keywords = Object.keys(search);
    // 模糊查询
    result = result.filter(item => {
      const keywordsFlag = lodash.fill(Array(keywords.length), true);
      keywords.forEach((key, index) => {
        // 某个搜索条件没有值，继续下一个
        if (!search[key] && search[key] !== 0) {
          return;
        }

        let target = item[key];
        if (typeof target === 'number') {
          target = String(target);
        } else if (Array.isArray(target)) {
          if (key === 'goods') {
            target = target.map(el => el.name).join(',');
          } else {
            target = target.join(',');
          }
        }

        // 如果目标对象没有值，判定为不符合
        if (!item[key] && item[key] !== 0) {
          keywordsFlag[index] = false;
        } else if (target.indexOf(String(search[key])) === -1) {
          keywordsFlag[index] = false;
        }
      });
      // 所有的搜索条件全部命中，才返回。搜索的条件的模糊搜索是「与」的关系
      if (keywordsFlag.indexOf(false) === -1) {
        return true;
      }
      return false;
    });
  }
  this.setState({
    filterResult: result,
  });
}

export function showError(msg) {
  if (!msg) {
    return;
  }

  Toast.info(
    <Fragment>
      <svg
        t="1561473935227"
        className="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="9670"
        width="60"
        height="60"
      >
        <path
          d="M512.8192 511.1808z m-458.9568 0a458.9568 458.9568 0 1 0 458.9568-458.9568 458.9568 458.9568 0 0 0-458.9056 458.9568"
          fill="#FB6664"
          p-id="9671"
        />
        <path
          d="M511.0272 740.6592a57.344 57.344 0 0 1-57.344-57.344V511.1808a57.344 57.344 0 1 1 114.688 0v172.0832a57.344 57.344 0 0 1-57.344 57.344z m0-344.2176A57.344 57.344 0 1 1 568.32 339.0464a57.344 57.344 0 0 1-57.344 57.344z"
          fill="#FFFFFF"
          p-id="9672"
        />
      </svg>
      <div>{msg}</div>
    </Fragment>,
    2
  );
}

export const refreshScroll = (scroll, data, prevData) => {
  if (data === prevData) {
    return;
  }

  if (scroll) scroll.refresh();
};

/**
 * 数字格式化
 * eg. 100 => 0
 *
 * eg. 1500 => 1.5k
 *
 * eg. 5550 => 5.6k
 *
 * eg 10000 => 1w
 *
 * @param {Number} count
 */
export function countFormatter(count) {
  if (!count) return 0;
  const result = +count;
  if (result < 1000) {
    return result;
  }

  if (result < 10000) {
    return `${(result / 1000).toFixed(1)}k`;
  }

  return `${(result / 10000).toFixed(1)}k`;
}
