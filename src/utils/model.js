import modelExtend from 'dva-model-extend';
import { PAGE_SIZE_DEFAULT } from '@/common/constants';

export const model = {
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export const pageModel = modelExtend(model, {
  state: {
    list: [],
    pagination: {
      hideOnSinglePage: false,
      showSizeChanger: true,
      showQuickJumper: true,
      // current: 1,
      // total: 0,
      showTotal: total => `共 ${total} 条`,
      pageSize: PAGE_SIZE_DEFAULT,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { stateKey, stateValue, pagination } = payload;
      return {
        ...state,
        [stateKey]: stateValue,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      };
    },
  },
});

export function* doPageRequest({ api, payload = {}, call, put, stateKey = 'list' }) {
  const response = yield call(api, {
    ...payload,
    page: (payload.page && payload.page - 1) || 0,
    pageSize: payload.pageSize || PAGE_SIZE_DEFAULT,
  });
  const { success, result } = response;
  if (success) {
    yield put({
      type: 'querySuccess',
      payload: {
        stateKey, // 需要更新的state
        stateValue: result, // state对象的值
        pagination: {
          // current: Number(payload.page) || 1,
          // pageSize: 1,
          total: result.length,
        },
      },
    });
  }
}
