import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Card, Divider, Form, Row, Col, Input, Button, Icon, Modal, DatePicker } from 'antd';
import { handleSearchReset, handleSearch, handleFilterResult } from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'umi/link';

const FormItem = Form.Item;

@Form.create()
@connect(({ businessModel: { list }, loading }) => ({
  list,
  loading: loading.effects['businessModel/queryBusinesses'],
}))
class BusinessList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line react/no-unused-state
      search: {},

      filterResult: props.list,
    };

    this.handleSearchReset = handleSearchReset.bind(this);
    this.handleSearch = handleSearch.bind(this);
    this.handleFilterResult = handleFilterResult.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleDelete = ({ id }) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确认删除吗？',
      content: '删除后，该内容将无法恢复！！',
      keyboard: false,
      maskClosable: false,
      onOk: () => {
        dispatch({
          type: 'businessModel/deleteBusiness',
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

    const { name, goods, endTime } = query;

    return (
      <Form className="searchForm" onSubmit={this.handleSearch} layout="inline">
        <Row gutter={10}>
          <Col md={6}>
            <FormItem label="商户名称">
              {getFieldDecorator('name', {
                initialValue: name,
              })(<Input placeholder="输入商户名称查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="商品名称">
              {getFieldDecorator('goods', {
                initialValue: goods,
              })(<Input placeholder="输入商铺名称查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="到期时间">
              {getFieldDecorator('endTime', {
                initialValue: endTime ? moment(endTime) : undefined,
              })(<DatePicker placeholder="输入到期日期查询" />)}
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

    const tableColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '商户名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '联系人',
        dataIndex: 'contact',
        align: 'center',
      },
      {
        title: '联系方式',
        dataIndex: 'telephone',
        align: 'center',
      },
      {
        title: '提供商品',
        dataIndex: 'goods',
        align: 'center',
      },
      {
        title: '提供日期',
        dataIndex: 'createTime',
        align: 'center',
        render: text => text && moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '到期日期',
        dataIndex: 'endTime',
        align: 'center',
        render: text => text && moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '操作人',
        dataIndex: 'operator',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        width: 100,
        render: (text, record) => {
          const { id } = record;
          return (
            <Fragment>
              <Link to={`/integral/list/${id}/update`}>修改</Link>
              <Divider type="vertical" />
              <a onClick={() => this.handleDelete(record)}>删除</a>
            </Fragment>
          );
        },
      },
    ];

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
            title={() => (
              <div style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={() => router.push('/integral/list/create')}>
                  新增商户
                </Button>
              </div>
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

export default BusinessList;
