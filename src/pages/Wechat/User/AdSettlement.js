import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import { Card } from 'antd-mobile';
import moment from 'moment';
import { SIGNING_GOLD_SETTLEMENT_STATE_SETTLED } from '@/common/constants';

import styles from './IntegralExchange.less';
import PullToRefreshWrap from '@/components/PullToRefresh';

@connect(({ driverModel: { adSettlements }, loading }) => ({
  adSettlements,
  loading: loading.effects['driverModel/queryUserSettlements'],
}))
class AdSettlement extends PureComponent {
  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/queryUserSettlements',
    });
  };

  render() {
    const { adSettlements, loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <DocumentTitle title="结算记录">
        <Fragment>
          <PullToRefreshWrap onRefresh={() => this.getList()}>
            <div className={styles.content}>
              {adSettlements.length === 0 ? (
                <Empty />
              ) : (
                adSettlements.map(item => (
                  <Card>
                    <Card.Header
                      title={
                        item.settlementState !== SIGNING_GOLD_SETTLEMENT_STATE_SETTLED ? (
                          <span className={styles.without}>待结算</span>
                        ) : (
                          <span className={styles.finish}>已结算</span>
                        )
                      }
                    />
                    <Card.Body>
                      <div>{item.title}</div>
                    </Card.Body>
                    <Card.Footer
                      content={
                        item.settlementTime && moment(item.settlementTime).format('YYYY-MM-DD')
                      }
                      extra={<div>￥{item.bonus}</div>}
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

export default AdSettlement;
