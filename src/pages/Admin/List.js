import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import { Card, Divider, Form, Row, Col, Input, Button, Icon, Popconfirm } from 'antd';
import { handleSearch, handleSearchReset, handleFilterResult } from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormModal from './FormModal';

const FormItem = Form.Item;

@Form.create()
@connect(({ adminModel: { list }, loading }) => ({
  list,
  loading: loading.effects['adminModel/queryAdmins'],
  submitLoading:
    loading.effects['adminModel/updateAdmin'] || loading.effects['adminModel/createAdmin'],
}))
class AdminList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      current: {},

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

  toogleModal = current => {
    this.setState(({ modalVisible }) => ({
      modalVisible: !modalVisible,
      current: current || {},
    }));
  };

  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: values.id ? 'adminModel/updateAdmin' : 'adminModel/createAdmin',
      payload: {
        ...values,
      },
    }).then(success => {
      if (success) {
        // 关闭弹出
        this.toogleModal();
      }
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminModel/deleteAdmin',
      payload: {
        id,
      },
    });
  };

  renderSearchForm = () => {
    const {
      form: { getFieldDecorator },
      location: { query },
    } = this.props;

    const { name, username } = query;

    return (
      <Form className="searchForm" onSubmit={this.handleSearch} layout="inline">
        <Row gutter={10}>
          <Col md={6}>
            <FormItem label="姓名">
              {getFieldDecorator('name', {
                initialValue: name,
              })(<Input placeholder="输入姓名查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="账号">
              {getFieldDecorator('username', {
                initialValue: username,
              })(<Input placeholder="输入账号查询" />)}
            </FormItem>
          </Col>
          <Col md={12}>
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
  };

  render() {
    const { modalVisible, current, filterResult } = this.state;
    const { loading, submitLoading } = this.props;

    const tableColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        width: 240,
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '账号',
        dataIndex: 'username',
        align: 'center',
      },
      {
        title: '密码',
        dataIndex: 'password',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        width: 140,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.toogleModal(record)}>修改密码</a>
            <Divider type="vertical" />
            <Popconfirm
              title={`确定删除[${record.name}]吗？`}
              onConfirm={() => this.handleDelete(record.id)}
              okText="删除"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
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
                <Button type="primary" onClick={() => this.toogleModal()}>
                  新增管理员
                </Button>
              </div>
            )}
            rowKey="id"
            loading={loading}
            columns={tableColumns}
            data={{ list: filterResult }}
          />
        </Card>
        <FormModal
          current={current}
          confirmLoading={submitLoading}
          visible={modalVisible}
          onCancel={this.toogleModal}
          onSubmit={this.handleSubmit}
        />
      </PageHeaderWrapper>
    );
  }
}

export default AdminList;
