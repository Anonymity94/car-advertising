import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import {
  queryDrivers,
  queryDriverById,
  auditDriver,
  updateDriverExpireTime,
  deleteDriver,
} from '@/services/driver';

export default modelExtend(model, {
  namespace: 'driverModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/application/drivers') {
          const payload = { ...location.query };
          dispatch({
            type: 'queryDrivers',
            payload,
          });
        }
        if (location.pathname === '/user/drivers') {
          const payload = { ...location.query };
          dispatch({
            type: 'queryDrivers',
            payload,
          });
        }
      });
    },
  },

  state: {
    list: [],
    detail: {}, // 车主详情
  },

  effects: {
    /**
     * 获取所有的车主列表
     */
    *queryDrivers({ payload = {} }, { call, put }) {
      const { success, result } = yield call(queryDrivers, payload);
      yield put({
        type: 'updateState',
        payload: {
          list: success ? result : [],
        },
      });
    },

    /**
     * 获取已经审核通过的车主列表
     */
    // *queryApprovedDrivers({ payload = {} }, { call, put }) {
    //   yield doPageRequest({
    //     api: queryApprovedDrivers,
    //     payload,
    //     call,
    //     put,
    //     stateKey: 'drivers',
    //   });
    // },

    /**
     * 车主详情
     */
    *queryDriverDetail({ payload }, { call, put }) {
      const { success, result } = yield call(queryDriverById, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },

    /**
     * 审核
     */
    *auditDriver({ payload }, { call }) {
      const { success } = yield call(auditDriver, payload);
      if (success) {
        message.success('审核成功');
      } else {
        message.error('审核失败');
      }
      return success;
    },

    /**
     * 修改行驶证到期时间
     */
    *updateDriverExpireTime({ payload }, { call, put }) {
      const { id } = payload;
      const { success } = yield call(updateDriverExpireTime, payload);
      if (success) {
        message.success('更新成功');
        yield put({
          type: 'queryDriverDetail',
          payload: {
            id,
          },
        });
      } else {
        message.error('更新失败');
      }
      return success;
    },

    /**
     * 删除
     */
    *deleteDriver({ payload }, { call }) {
      const { success } = yield call(deleteDriver, payload);
      if (success) {
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
      return success;
    },
  },
});
