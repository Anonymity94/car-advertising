import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import { Card } from 'antd-mobile';
import moment from 'moment';
import styles from './IntegralExchange.less';
import { INTEGRAL_SETTLEMENT_STATE_YES } from '@/common/constants';
import PullToRefreshWrap from '@/components/PullToRefresh';

@connect(({ driverModel: { integralExchanges }, loading }) => ({
  integralExchanges,
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
        this.getList();
      }
    );
  };

  render() {
    const { refresh } = this.state;
    const { integralExchanges, loading } = this.props;

    if (loading && !refresh) {
      return <Loading />;
    }

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
                      extra={<span>兑换码：{item.exchangeCode}</span>}
                    />
                    <Card.Body>
                      <div>{item.goodsName}</div>
                    </Card.Body>
                    <Card.Footer
                      content={`${item.createTime &&
                        `${moment(item.createTime).format('YYYY-MM-DD')}/`}${item.businessName}`}
                      extra={<div>{item.integral}乐蚁果</div>}
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
