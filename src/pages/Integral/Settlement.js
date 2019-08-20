import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import numeral from 'numeral';
import { Card, Form, Row, Col, Input, Button, DatePicker, List, Modal, Divider } from 'antd';
import { Field } from '@/components/Charts';
import { handleSearchReset, handleSearch, handleFilterResult } from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './styles.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ integralSettlementModel: { list, totalMoney, unpaid }, loading }) => ({
  list,
  unpaid,
  totalMoney,
  loading: loading.effects['integralSettlementModel/querySettlements'],
}))
class Settlement extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line react/no-unused-state
      search: {},

      list: [],
      filterResult: [],
    };

    this.handleSearchReset = handleSearchReset.bind(this);
    this.handleSearch = handleSearch.bind(this);
    this.handleFilterResult = handleFilterResult.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  static getDerivedStateFromProps(nextProps, state) {
    if (!isEqual(nextProps.list, state.list)) {
      return {
        list: nextProps.list,
        filterResult: nextProps.list,
      };
    }
    return null;
  }

  renderUnpaidItem = item => (
    <section className={styles.unpaidList}>
      <Field label="名称:" value={item.username} />
      <Field label="乐蚁果数:" value={item.integral} />
      <Field label="金额数:" value={`￥${numeral(item.money).format('0,0')}`} />
      <Field label="手机号:" value={item.telephone} />
    </section>
  );

  doSettlement = ({ id, ...reset }) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: `确定结账吗？`,
      content: <Fragment>{this.renderUnpaidItem(reset)}</Fragment>,
      keyboard: false,
      maskClosable: false,
      onOk: () => {
        dispatch({
          type: 'integralSettlementModel/doSettlement',
          payload: {
            id,
          },
        });
      },
    });
  };

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      location: { query },
    } = this.props;

    const { username, settlementTime, operator } = query;

    return (
      <Form className="searchForm" onSubmit={this.handleSearch} layout="inline">
        <Row gutter={10}>
          <Col md={6}>
            <FormItem label="用户名称">
              {getFieldDecorator('username', {
                initialValue: username,
              })(<Input placeholder="输入用户名称查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="结账日期">
              {getFieldDecorator('settlementTime', {
                initialValue: settlementTime ? moment(settlementTime) : undefined,
              })(<DatePicker placeholder="输入结账日期查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="处理人">
              {getFieldDecorator('operator', {
                initialValue: operator,
              })(<Input placeholder="输入处理人查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem>
              <div className="searchFormOperate">
                <Button icon="search" type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button icon="reload" className="resetBtn" onClick={this.handleSearchReset}>
                  重置
                </Button>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { filterResult } = this.state;
    const { loading, list, unpaid, totalMoney } = this.props;

    const tableColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        align: 'center',
        width: 200,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        align: 'center',
      },
      {
        title: '乐蚁果数',
        dataIndex: 'integral',
        align: 'center',
      },
      {
        title: '金额数',
        dataIndex: 'money',
        align: 'center',
        render: text => `￥${numeral(text).format('0,0')}`,
      },
      {
        title: '手机号',
        dataIndex: 'telephone',
        align: 'center',
      },
      {
        title: '结账日期',
        dataIndex: 'settlementTime',
        align: 'center',
        render: text => text && moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '处理人',
        dataIndex: 'operator',
        align: 'center',
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card size="small" bordered={false} title="未结账乐蚁果" style={{ marginBottom: 10 }}>
          <List
            grid={{
              gutter: 10,
              sm: 2,
              lg: 4,
              xl: 6,
            }}
            dataSource={unpaid}
            pagination={{
              pageSize: 12,
            }}
            renderItem={item => (
              <List.Item>
                <Card size="small">
                  {this.renderUnpaidItem(item)}
                  <Button
                    className={styles.settlementBtn}
                    type="primary"
                    onClick={() => this.doSettlement(item)}
                  >
                    结账
                  </Button>
                </Card>
              </List.Item>
            )}
          />
        </Card>
        <Card size="small" bordered={false} title="已结账乐蚁果">
          {this.renderSearchForm()}
          <StandardTable
            title={() => (
              <Fragment>
                <ul className={styles.total}>
                  <li>
                    总计：<span>￥{numeral(totalMoney).format('0,0')}元</span>
                  </li>
                  <Divider className={styles.divier} type="vertical" />
                  <li>
                    总数：<span>{list.length}</span>
                  </li>
                </ul>
              </Fragment>
            )}
            rowKey="id"
            loading={loading}
            columns={tableColumns}
            data={{ list: filterResult }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Settlement;
