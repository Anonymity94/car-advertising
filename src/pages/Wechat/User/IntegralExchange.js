import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { Card } from 'antd-mobile';
import styles from './IntegralExchange.less';

export default class IntegralExchange extends PureComponent {
  render() {
    return (
      <DocumentTitle title="兑换记录">
        <div className={styles.content}>
          <Card>
            <Card.Header title={<span className={styles.unused}>未使用</span>} extra={<span>兑换码：343434</span>} />
            <Card.Body>
              <div>车载产品的使用一般需要通过车载点烟器来给予供电，车载产品已经深入。</div>
            </Card.Body>
            <Card.Footer content="2019-06-25/商户名" extra={<div>300积分</div>} />
          </Card>
          <Card>
            <Card.Header title={<span className={styles.used}>已使用</span>} extra={<span>兑换码：343434</span>} />
            <Card.Body>
              <div>车载产品的使用一般需要通过车载点烟器来给予供电，车载产品已经深入。</div>
            </Card.Body>
            <Card.Footer content="2019-06-25/商户名" extra={<div>300积分</div>} />
          </Card>
        </div>
      </DocumentTitle>
    );
  }
}
