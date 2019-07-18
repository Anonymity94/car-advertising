import React, { PureComponent } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import { Card } from 'antd-mobile';
import moment from 'moment';
import styles from './IntegralExchange.less';
import { INTEGRAL_SETTLEMENT_STATE_YES } from '@/common/constants';

@connect(({ driverModel: { integralExchanges }, loading }) => ({
  integralExchanges,
  loading: loading.effects['driverModel/queryUserExchanges'],
}))
class IntegralExchange extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/queryUserExchanges',
    });
  }

  render() {
    const { integralExchanges, loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <DocumentTitle title="兑换记录">
        <div className={styles.content}>
          {integralExchanges.length === 0 ? (
            <Empty />
          ) : (
            integralExchanges.map(item => (
              <Card>
                <Card.Header
                  title={
                    item.state !== INTEGRAL_SETTLEMENT_STATE_YES ? (
                      <span className={styles.without}>未使用</span>
                    ) : (
                      <span className={styles.finish}>已使用</span>
                    )
                  }
                />
                <Card.Body>
                  <div>{item.goodsName}</div>
                </Card.Body>
                <Card.Footer
                  content={`${item.createTime &&
                    `${moment(item.createTime).format('YYYY-MM-DD')}/`}${item.businessName}`}
                  extra={<div>{item.integral}积分</div>}
                />
              </Card>
            ))
          )}
        </div>
      </DocumentTitle>
    );
  }
}

export default IntegralExchange;
