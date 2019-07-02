/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Spin, Icon, Badge } from 'antd';
import { Bar } from '@/components/Charts';

import router from 'umi/router';
import styles from './Workplace.less';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const modules = [
  {
    key: 'ad-signing',
    name: '广告签约管理',
    link: '/application/ad-signings',
  },
  {
    key: 'user-verify',
    name: '审核管理',
    link: '/application/drivers',
  },
  {
    key: 'user-appeal',
    name: '申诉管理',
    link: '/application/appeals',
  },
  {
    key: 'ad-content',
    name: '广告内容管理',
    link: '/application/ads',
  },
  {
    key: 'integral-settlement',
    name: '积分提现管理',
    link: '/application/integral/settlement',
  },
];

const aWeekAgo = moment()
  .subtract(6, 'days')
  .format('YYYY-MM-DD');
const today = moment().format('YYYY-MM-DD');

@connect(({ reportModel: { registerMetrics, todoMetrics, signingMetrics }, loading }) => ({
  registerMetrics,
  todoMetrics,
  signingMetrics,
  loading,
}))
class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportModel/countRegisterMetrics',
      payload: {
        startTime: aWeekAgo,
        endTime: today,
      },
    });
    dispatch({
      type: 'reportModel/countSigningMetrics',
      payload: {
        startTime: aWeekAgo,
        endTime: today,
      },
    });
    dispatch({
      type: 'reportModel/countTodos',
    });
  }

  componentWillUnmount() {}

  computedCount = moduleKey => {
    const { todoMetrics } = this.props;
    if (!moduleKey || !Array.isArray(todoMetrics)) return 0;

    const find = todoMetrics.find(item => item.module === moduleKey);
    if (!find) return 0;

    return find.count;
  };

  render() {
    const { signingMetrics, registerMetrics, loading } = this.props;
    return (
      <Fragment>
        <Card size="small" bordered={false} style={{ marginBottom: 20 }}>
          <Row gutter={10}>
            <Col sm={24} md={12}>
              <Spin
                indicator={antIcon}
                spinning={loading.effects['reportModel/countSigningMetrics']}
              >
                <Bar height={200} title="最近7天签约人数" data={signingMetrics} />
              </Spin>
            </Col>
            <Col sm={24} md={12}>
              <Spin
                indicator={antIcon}
                spinning={loading.effects['reportModel/countRegisterMetrics']}
              >
                <Bar height={200} title="最近7天注册人数" data={registerMetrics} />
              </Spin>
            </Col>
          </Row>
        </Card>
        <Card title="代办事项" size="small" bordered={false} className={styles.todosList}>
          {modules.map(item => (
            <Card.Grid onClick={() => router.push(item.link)}>
              <div className={styles.grid}>
                <div className={styles.avatar}>
                  <img src={require(`./icons/${item.key}.png`)} alt={item.name} />
                </div>
                <div className={styles.meta}>
                  <Badge count={this.computedCount(item.key)} overflowCount={999}>
                    <div className={styles.title}>{item.name}</div>
                  </Badge>
                </div>
              </div>
            </Card.Grid>
          ))}
        </Card>
      </Fragment>
    );
  }
}

export default Workplace;
