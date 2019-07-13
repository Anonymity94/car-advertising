import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';
import {
  queryGoods,
  queryGoodsContent,
  createGoods,
  updateGoods,
  publishGoods,
  topGoods,
  deleteGoods,
  checkUserExchangeState,
  exchangeGood,
} from '@/services/goods';

export default modelExtend(model, {
  namespace: 'goodsModel',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/integral/goods') {
          dispatch({
            type: 'queryGoods',
          });
        }
      });
    },
  },

  state: {
    list: [],
    detail: {},
  },

  effects: {
    /**
     * 获取商品列表
     */
    *queryGoods({ payload = {} }, { call, put }) {
      const { success, result } = yield call(queryGoods, payload);

      let list = success ? result : [];
      // 微信端过滤出已发布的
      if (payload.isPublish) {
        list = list.filter(item => item.isPublish === payload.isPublish);
      }

      yield put({
        type: 'updateState',
        payload: {
          list,
        },
      });

      return {
        success,
        list,
      };
    },

    /**
     * 商品详情
     */
    *queryGoodsContent({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          detail: {},
        },
      });

      const { success, result } = yield call(queryGoodsContent, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },

    /**
     * 新建商品
     */
    *createGoods({ payload }, { call, put }) {
      const { success } = yield call(createGoods, payload);
      if (success) {
        message.success('新建商品成功');
        if (!payload.businessId) {
          yield put({
            type: 'queryGoods',
          });
        }
      } else {
        message.error('新建商品失败');
      }
      return success;
    },

    /**
     * 修改商品内容
     */
    *updateGoods({ payload }, { call }) {
      const { success } = yield call(updateGoods, payload);
      if (success) {
        message.success('内容修改成功');
      } else {
        message.error('内容修改失败');
      }
      return success;
    },

    /**
     * 发布商品
     */
    *publishGoods({ payload }, { call, put }) {
      const { success } = yield call(publishGoods, payload);
      if (success) {
        message.success('发布成功');
        yield put({
          type: 'queryGoods',
        });
      } else {
        message.error('发布失败');
      }
      return success;
    },

    /**
     * 置顶商品
     */
    *topGoods({ payload }, { call, put }) {
      const { success } = yield call(topGoods, payload);
      if (success) {
        message.success('置顶成功');
        yield put({
          type: 'queryGoods',
        });
      } else {
        message.error('置顶失败');
      }
      return success;
    },

    /**
     * 删除商品
     */
    *deleteGoods({ payload }, { call, put }) {
      const { success } = yield call(deleteGoods, payload);
      if (success) {
        message.success('删除成功');
        if (!payload.businessId) {
          yield put({
            type: 'queryGoods',
          });
        }
      } else {
        message.error('删除失败');
      }
      return success;
    },

    /**
     * 检查某个人是否已经兑换或某件商品
     */
    *checkUserExchangeState({ payload }, { call }) {
      return yield call(checkUserExchangeState, payload);
    },

    /**
     * 兑换商品
     */
    *exchangeGood({ payload }, { call }) {
      const { success } = yield call(exchangeGood, payload);
      return success;
    },
  },
});
