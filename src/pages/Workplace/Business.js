/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Avatar, Icon, Button } from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';

import styles from './Business.less';

const tableColumns = [
  {
    title: '姓名',
    dataIndex: 'usename',
    align: 'center',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    align: 'center',
  },
  {
    title: '兑换物品',
    dataIndex: 'goods',
    align: 'center',
  },
  {
    title: '所获积分',
    dataIndex: 'integral',
    align: 'center',
  },
  {
    title: '兑换日期',
    dataIndex: 'settlementTime',
    align: 'center',
    render: text => text && moment(text).format('YYYY-MM-DD'),
  },
  {
    title: '审核人',
    dataIndex: 'operator',
    align: 'center',
  },
];

@connect(({ reportModel: { registerMetrics, todoMetrics, signingMetrics }, loading }) => ({
  registerMetrics,
  todoMetrics,
  signingMetrics,
  loading,
}))
class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
  }

  componentWillUnmount() {}

  render() {
    const { loading } = this.props;
    return (
      <Fragment>
        <Card size="small" bordered={false} style={{ marginBottom: 20 }}>
          <Row gutter={10}>
            <Col sm={24} md={5} className={styles.avatar}>
              <div>
                <Avatar style={{ verticalAlign: 'middle' }} size="large">
                  商户名称
                </Avatar>
              </div>
              <p className={styles.title}>商户名称</p>
            </Col>
            <Col sm={24} md={7} style={{ textAlign: 'center' }}>
              <p className={styles.label}>已服务客户</p>
              <p className={styles.value}>30人</p>
            </Col>
            <Col sm={24} md={5} style={{ textAlign: 'center' }}>
              <p className={styles.label}>可提现积分</p>
              <p className={styles.value}>
                <div className={styles.red}>
                  <span>300分</span>
                  <Icon type="arrow-right" />
                  <span>300元</span>
                </div>
                <Button size="small" type="primary">提现</Button>
              </p>
            </Col>
            <Col sm={24} md={7} style={{ textAlign: 'center' }}>
              <p className={styles.label}>已提现积分</p>
              <p className={styles.value}>30人</p>
            </Col>
          </Row>
        </Card>
        <Card
          title="已兑换客户"
          size="small"
          bordered={false}
          className={styles.todosList}
          extra={<Button type="primary">兑换</Button>}
        >
          <StandardTable rowKey="id" loading={loading} columns={tableColumns} data={{ list: [] }} />
        </Card>
      </Fragment>
    );
  }
}

export default Workplace;
