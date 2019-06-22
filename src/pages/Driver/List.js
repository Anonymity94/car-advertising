import React, { PureComponent, Fragment } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { Card, Divider, Form, Row, Col, Input, Select, Button, DatePicker, Icon } from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  handlePageRefresh,
  handleSearchReset,
  handleSearch,
  handleFilterResult,
} from '@/utils/utils';

import { AUDIT_STATE_LIST, AUDIT_STATE_UNREVIEWED } from '@/common/constants';

const FormItem = Form.Item;

const tableColumns = [
  {
    title: '会员编号',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    align: 'center',
  },
  {
    title: '身份证号',
    dataIndex: 'idcard',
    align: 'center',
  },
  {
    title: '提交日期',
    dataIndex: 'createTime',
    align: 'center',
    render: text => text && moment(text).format('YYYY-MM-DD'),
  },
  {
    title: '状态',
    dataIndex: 'stateText',
    align: 'center',
  },
  {
    title: '审核人',
    dataIndex: 'verifyName',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 140,
    align: 'center',
    render: (text, record) => (
      <Fragment>
        <Link to={`/application/drivers/${record.id}/audit`}>审核</Link>
        <Divider type="vertical" />
        <Link to={`/application/drivers/${record.id}`}>查看</Link>
      </Fragment>
    ),
  },
];

@Form.create()
@connect(({ driverModel: { list, pagination }, loading }) => ({
  list,
  pagination,
  loading: loading.effects['driverModel/queryDrivers'],
}))
class List extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      search: {},

      filterResult: props.list,
    };

    this.handlePageRefresh = handlePageRefresh.bind(this);
    this.handleSearchReset = handleSearchReset.bind(this);
    this.handleSearch = handleSearch.bind(this);
    this.handleFilterResult = handleFilterResult.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      location: { query },
    } = this.props;

    const { name, createTime, state } = query;

    return (
      <Form className="searchForm" onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col md={6}>
            <FormItem label="姓名">
              {getFieldDecorator('name', {
                initialValue: name,
              })(<Input placeholder="输入姓名查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="提交日期">
              {getFieldDecorator('createTime', {
                initialValue: createTime ? moment(createTime) : undefined,
              })(
                <DatePicker disabledDate={current => current && current > moment().endOf('day')} />
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="状态">
              {getFieldDecorator('state', {
                initialValue: state,
              })(
                <Select placeholder="请选择审核状态">
                  <Select.Option key="" value="">
                    全部
                  </Select.Option>
                  {AUDIT_STATE_LIST.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              )}
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
    const { loading } = this.props;
    return (
      <PageHeaderWrapper>
        <Card
          size="small"
          bordered={false}
          title={
            <div>
              <Icon type="search" /> 筛选查询
            </div>
          }
          style={{ marginBottom: 10 }}
        >
          {this.renderSearchForm()}
        </Card>
        <Card bodyStyle={{ padding: 0 }} bordered={false}>
          <div className="searchWrap" />
          <StandardTable
            rowKey="id"
            loading={loading}
            columns={tableColumns}
            data={{ list: filterResult }}
            rowClassName={record => (record.state === AUDIT_STATE_UNREVIEWED ? 'trStrikingBg' : '')}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default List;
