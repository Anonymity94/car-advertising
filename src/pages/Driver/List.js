import React, { PureComponent, Fragment } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import {
  Card,
  Divider,
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  DatePicker,
  Icon,
  Tag,
  Tooltip,
} from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { handleSearchReset, handleSearch, handleFilterResult } from '@/utils/utils';

import {
  AUDIT_STATE_LIST,
  AUDIT_STATE_UNREVIEWED,
  AUDIT_STATE_PASSED,
  AUDIT_STATE_REFUSE,
} from '@/common/constants';

const FormItem = Form.Item;

const tableColumns = [
  {
    title: '会员编号',
    dataIndex: 'id',
    align: 'center',
    width: 240,
  },
  {
    title: '姓名',
    dataIndex: 'username',
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
    dataIndex: 'status',
    align: 'center',
    render: (text, record) => {
      if (text === AUDIT_STATE_PASSED) return <Tag color="#87d068">通过</Tag>;
      if (text === AUDIT_STATE_REFUSE) {
        const { bandReason } = record;
        if (bandReason) {
          return (
            <Tooltip title={bandReason}>
              <Tag color="#f50">不通过</Tag>
            </Tooltip>
          );
        }
        return <Tag color="#f50">不通过</Tag>;
      }
      return '待审核';
    },
  },
  {
    title: '审核时间',
    dataIndex: 'verifyTime',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 140,
    align: 'center',
    render: (text, record) => (
      <Fragment>
        {record.status === AUDIT_STATE_PASSED && [
          <Link to={`/application/drivers/${record.id}/update`}>修改</Link>,
          <Divider type="vertical" />,
        ]}
        {(record.status === AUDIT_STATE_UNREVIEWED || !record.status) && [
          <Link to={`/application/drivers/${record.id}/audit`}>审核</Link>,
          <Divider type="vertical" />,
        ]}
        <Link to={`/application/drivers/${record.id}`}>查看</Link>
      </Fragment>
    ),
  },
];

@Form.create()
@connect(({ driverModel: { list }, loading }) => ({
  list,
  loading: loading.effects['driverModel/queryDrivers'],
}))
class List extends PureComponent {
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

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      location: { query },
    } = this.props;

    const { username, createTime, status } = query;

    return (
      <Form className="searchForm" onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col md={6}>
            <FormItem label="姓名">
              {getFieldDecorator('username', {
                initialValue: username,
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
              {getFieldDecorator('status', {
                initialValue: status,
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
            rowClassName={record =>
              record.status === AUDIT_STATE_UNREVIEWED ? 'trStrikingBg' : ''
            }
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default List;
