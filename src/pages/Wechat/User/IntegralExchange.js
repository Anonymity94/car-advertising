import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import { Card, Modal, Toast } from 'antd-mobile';
import moment from 'moment';
import styles from './IntegralExchange.less';
import {
  INTEGRAL_SETTLEMENT_STATE_YES,
  GOOD_EXCHANGE_TYPE_SELF_MAIL,
  GOOD_EXCHANGE_TYPE_SELF_TAKING,
  EXCHANGE_CANCEL_WAITING,
  INTEGRAL_SETTLEMENT_STATE_NO,
  EXCHANGE_CANCEL_APPROVE,
  EXCHANGE_CANCEL_REFUSE,
} from '@/common/constants';
import PullToRefreshWrap from '@/components/PullToRefresh';

@connect(({ driverModel: { integralExchanges }, driverModel: { detail: userInfo }, loading }) => ({
  integralExchanges,
  userInfo,
  loading: loading.effects['driverModel/queryUserExchanges'],
}))
class IntegralExchange extends PureComponent {
  state = {
    refresh: false,
  };

  componentDidMount() {
    this.queryUserExchanges();
  }

  queryUserExchanges = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/queryUserExchanges',
    }).then(() => {
      this.setState({
        refresh: false,
      });
    });
  };

  handleRefresh = () => {
    this.setState(
      {
        refresh: true,
      },
      () => {
        this.queryUserExchanges();
      }
    );
  };

  handleGiveback = exchangeLog => {
    const { state, id, cancelState, exchangeType } = exchangeLog;
    if (cancelState === EXCHANGE_CANCEL_WAITING) {
      Modal.alert('退还审核中', '请耐心等待审核', [
        {
          text: '知道了',
          onPress: () => {},
        },
      ]);
      return;
    }

    if (cancelState === EXCHANGE_CANCEL_APPROVE) {
      Modal.alert('退还已完成', '退还已完成，无法再次退还', [
        {
          text: '知道了',
          onPress: () => {},
        },
      ]);
      return;
    }

    // 1. 自取
    if (exchangeType === GOOD_EXCHANGE_TYPE_SELF_TAKING) {
      // 1.1 没有使用，直接取消
      if (state === INTEGRAL_SETTLEMENT_STATE_NO) {
        this.doGiveback(id, EXCHANGE_CANCEL_APPROVE);
        return;
      }
      // 已经使用了，需要填写原因
      if (state === INTEGRAL_SETTLEMENT_STATE_YES) {
        this.showReasonModal(id);
        return;
      }
    }

    // 2. 邮寄
    if (exchangeType === GOOD_EXCHANGE_TYPE_SELF_MAIL) {
      if (state === INTEGRAL_SETTLEMENT_STATE_NO) {
        this.doGiveback(id, EXCHANGE_CANCEL_APPROVE);
        return;
      }
      // 已经使用了，需要填写原因
      if (state === INTEGRAL_SETTLEMENT_STATE_YES) {
        this.showReasonModal(id);
        return;
      }
    }

    Modal.alert('退还失败', '不符合退还条件', [
      {
        text: '知道了',
        onPress: () => {},
      },
    ]);
  };

  showReasonModal = id => {
    Modal.prompt(
      '退还乐蚁果',
      '请输入退还原因',
      [
        {
          text: '取消',
        },
        {
          text: '提交',
          onPress: reason => {
            if (!reason || !reason.replace(/ /g, '')) {
              Toast.info('请填写退还原因', 1);
              return;
            }
            // 提交退还申请
            this.doGiveback(id, EXCHANGE_CANCEL_WAITING, reason);
          },
        },
      ],
      'default',
      null,
      ['填写退还原因']
    );
  };

  doGiveback = (id, cancelState, reason = '') => {
    const { dispatch, userInfo, integralExchanges } = this.props;
    Toast.loading('提交中...', 0);
    dispatch({
      type: 'goodsExchangeModel/updateExchangeLog',
      payload: {
        id,
        cancelState,
        reason,
        applyCancelTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
    }).then(success => {
      Toast.hide();
      if (!success) {
        Modal.alert('退还失败', '请稍候再试', [
          {
            text: '知道了',
            onPress: () => {},
          },
        ]);
      } else {
        // 如果直接退还完成，需要返回用户的乐蚁果
        if (cancelState === EXCHANGE_CANCEL_APPROVE) {
          const { restIntegral = 0, usedIntegral = 0, id: userId } = userInfo;
          const find = integralExchanges.find(item => item.id === id);
          if (find) {
            const payIntegral = find.integral * (find.count || 1);
            this.updateDriverIntegral({
              id: userId,
              restIntegral: restIntegral - payIntegral,
              usedIntegral: usedIntegral + payIntegral,
            });
          }
        }
        Modal.alert('退还成功', '', [
          {
            text: '知道了',
            onPress: () => {},
          },
        ]);
      }
    });
  };

  /**
   * 退还用户的乐蚁果
   */
  updateDriverIntegral = ({ id, restIntegral, usedIntegral }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/updateDriverIntegral',
      payload: {
        id,
        restIntegral,
        usedIntegral,
      },
    });
  };

  render() {
    const { refresh } = this.state;
    const { integralExchanges, loading } = this.props;

    if (loading && !refresh) {
      return <Loading />;
    }

    const renderExtraHtml = log => {
      const { cancelState } = log;
      if (cancelState === EXCHANGE_CANCEL_WAITING) {
        return <span>退还审核中</span>;
      }
      if (cancelState === EXCHANGE_CANCEL_APPROVE) {
        return <span>已退还</span>;
      }
      if (cancelState === EXCHANGE_CANCEL_REFUSE) {
        return <span>退还被拒绝</span>;
      }
      return (
        <span onClick={() => this.handleGiveback(log)} className={styles.applyCancelBtn}>
          退还乐蚁果
        </span>
      );
    };

    return (
      <DocumentTitle title="兑换记录">
        <Fragment>
          <PullToRefreshWrap onRefresh={() => this.handleRefresh()}>
            <div className={styles.content}>
              {integralExchanges.length === 0 ? (
                <Empty />
              ) : (
                integralExchanges.map(item => (
                  <Card>
                    <Card.Header
                      title={
                        <Fragment>
                          {item.state !== INTEGRAL_SETTLEMENT_STATE_YES ? (
                            <span className={styles.without}>未使用</span>
                          ) : (
                            <span className={styles.finish}>已使用</span>
                          )}
                        </Fragment>
                      }
                      extra={
                        <span>
                          兑换方式：
                          {item.exchangeType === GOOD_EXCHANGE_TYPE_SELF_MAIL ? '邮寄' : '自取'}
                        </span>
                      }
                    />
                    <Card.Body>
                      <div className={styles.goodsContent}>
                        <span>
                          {item.count || 1}个{item.goodsName}-{item.businessName}
                        </span>
                        <span>{item.integral}乐蚁果</span>
                      </div>
                      <div>
                        {item.exchangeType === GOOD_EXCHANGE_TYPE_SELF_TAKING && (
                          <p>兑换码：{item.exchangeCode}</p>
                        )}
                        {item.exchangeType === GOOD_EXCHANGE_TYPE_SELF_MAIL && (
                          <p>邮寄地址：{item.address}</p>
                        )}
                      </div>
                    </Card.Body>
                    <Card.Footer
                      content={`${item.createTime &&
                        `${moment(item.createTime).format('YYYY-MM-DD')}/`}${item.businessName}`}
                      extra={renderExtraHtml(item)}
                    />
                  </Card>
                ))
              )}
            </div>
          </PullToRefreshWrap>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default IntegralExchange;
