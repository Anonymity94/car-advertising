import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Divider, Form, Row, Col, Input, Button, Icon, Popconfirm, Modal } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  handlePageRefresh,
  handleSearchReset,
  handleTableChange,
  passwordReg,
} from '@/utils/utils';

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
      confirmDirty: false,
      current: {},
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
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

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码不一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { confirmDirty } = this.state;
    const { form } = this.props;
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
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

  handleSubmit = e => {
    const { current } = this.state;
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'adminModel/updateAdminPassword',
          payload: {
            id: current.id,
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
    const {
      admins,
      pagination,
      loading,
      submitLoading,
      form: { getFieldDecorator },
    } = this.props;

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
        <Modal
          title="修改密码"
          width={640}
          destroyOnClose
          maskClosable={false}
          keyboard={false}
          confirmLoading={submitLoading}
          visible={modalVisible}
          onOk={this.handleSubmit}
          onCancel={this.toogleModal}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="id" style={{ display: 'none' }}>
              {getFieldDecorator('id', {
                rules: [{ required: true, message: '请输入任务名称' }],
                initialValue: current.id,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="姓名" {...this.formLayout}>
              {current.fullName}
            </FormItem>
            <FormItem label="新密码" {...this.formLayout}>
              {getFieldDecorator('password', {
                validateFirst: true,
                rules: [
                  { required: true, message: '请输入新密码' },
                  {
                    pattern: passwordReg,
                    message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<Input.Password placeholder="请输入新密码" />)}
            </FormItem>
            <FormItem label="确认密码" {...this.formLayout}>
              {getFieldDecorator('confirm', {
                rules: [
                  { required: true, message: '请再次输入新密码' },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password placeholder="请再次输入新密码" />)}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default AdminList;
