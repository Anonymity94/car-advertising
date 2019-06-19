import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Divider, Form, Row, Col, Input, Button, Icon, Popconfirm } from 'antd';
import { handlePageRefresh, handleSearchReset, handleTableChange } from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PasswordModal from './PasswordModal';

const FormItem = Form.Item;

@Form.create()
@connect(({ adminModel: { admins, pagination }, loading }) => ({
  admins,
  pagination,
  loading: loading.effects['adminModel/queryAdmins'],
  submitLoading: loading.effects['adminModel/updateAdminPassword'],
}))
class AdminList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      current: {},
    };

    this.handlePageRefresh = handlePageRefresh.bind(this);
    this.handleSearchReset = handleSearchReset.bind(this);
    this.handleTableChange = handleTableChange.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  queryData = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;

    dispatch({
      type: 'adminModel/queryAdmins',
      payload: {
        ...query,
      },
    });
  };

  toogleModal = current => {
    this.setState(({ modalVisible }) => ({
      modalVisible: !modalVisible,
      current: current || {},
    }));
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.handlePageRefresh({
        ...fieldsValue,
        page: 1,
      });
    });
  };

  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminModel/updateAdminPassword',
      payload: {
        id: values.id,
        password: values.password,
      },
    }).then(success => {
      if (success) {
        // 关闭弹出
        this.toogleModal();
        // 重新获取数据
        this.queryData();
      }
    });
  };

  handleDelete = id => {
    const { dispatch, admins, pagination } = this.props;
    dispatch({
      type: 'adminModel/deleteAdmin',
      payload: {
        id,
      },
    }).then(success => {
      if (success) {
        this.handlePageRefresh({
          page:
            // 如果删除前只有1条数据，并且页码不是1，就请求上一页数据
            admins.length === 1 && pagination.current > 1
              ? pagination.current - 1
              : pagination.current,
        });
      }
    });
  };

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      location: { query },
    } = this.props;

    const { fullName, userName } = query;

    return (
      <Form className="searchForm" onSubmit={this.handleSearch} layout="inline">
        <Row gutter={10}>
          <Col md={6}>
            <FormItem label="姓名">
              {getFieldDecorator('fullName', {
                initialValue: fullName,
              })(<Input placeholder="输入姓名查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="账号">
              {getFieldDecorator('userName', {
                initialValue: userName,
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
  }

  render() {
    const { modalVisible, current } = this.state;
    const { admins, pagination, loading, submitLoading } = this.props;

    const tableColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'fullName',
        align: 'center',
      },
      {
        title: '账号',
        dataIndex: 'userName',
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
              title={`确定删除[${record.fullName}]吗？`}
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
            rowKey="id"
            loading={loading}
            columns={tableColumns}
            data={{ list: admins, pagination }}
            onChange={this.handleTableChange}
          />
        </Card>
        <PasswordModal
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
