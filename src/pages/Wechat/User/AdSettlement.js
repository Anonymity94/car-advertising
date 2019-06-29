import React, { PureComponent } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import { Card } from 'antd-mobile';
import { SIGNING_GOLD_SETTLEMENT_STATE_UN_SETTLED } from '@/common/constants';

import styles from './IntegralExchange.less';

@connect(({ driverModel: { adSettlements }, loading }) => ({
  adSettlements,
  loading: loading.effects['driverModel/queryUserSettlements'],
}))
class AdSettlement extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/queryUserSettlements',
    });
  }

  render() {
    const { adSettlements, loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <DocumentTitle title="结算记录">
        <div className={styles.content}>
          {adSettlements.length === 0 ? (
            <Empty />
          ) : (
            adSettlements.map(item => (
              <Card>
                <Card.Header
                  title={
                    item.settlementState === SIGNING_GOLD_SETTLEMENT_STATE_UN_SETTLED ? (
                      <span className={styles.without}>待结算</span>
                    ) : (
                      <span className={styles.finish}>已结算</span>
                    )
                  }
                />
                <Card.Body>
                  <div>{item.adTitle}</div>
                </Card.Body>
                <Card.Footer content={item.createTime} extra={<div>￥{item.bonus}</div>} />
              </Card>
            ))
          )}
        </div>
      </DocumentTitle>
    );
  }
}

export default AdSettlement;
