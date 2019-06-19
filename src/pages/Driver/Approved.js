import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Divider, Form, Row, Col, Input, Button, DatePicker, Icon, Popconfirm } from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { handlePageRefresh, handleSearchReset, handleTableChange } from '@/utils/utils';

import router from 'umi/router';

const FormItem = Form.Item;

@Form.create()
@connect(({ driverModel: { drivers, pagination }, loading }) => ({
  drivers,
  pagination,
  loading: loading.effects['driverModel/queryApprovedDrivers'],
}))
class Audited extends PureComponent {
  constructor(props) {
    super(props);
    this.handlePageRefresh = handlePageRefresh.bind(this);
    this.handleSearchReset = handleSearchReset.bind(this);
    this.handleTableChange = handleTableChange.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { drivingPermitDueTime } = fieldsValue;
      this.handlePageRefresh({
        ...fieldsValue,
        drivingPermitDueTime: drivingPermitDueTime
          ? moment(drivingPermitDueTime).format('YYYY-MM-DD')
          : '',
        page: 1,
      });
    });
  };

  handleDelete = id => {
    const { dispatch, drivers, pagination } = this.props;
    dispatch({
      type: 'driverModel/deleteDriver',
      payload: {
        id,
      },
    }).then(success => {
      if (success) {
        this.handlePageRefresh({
          page:
            // 如果删除前只有1条数据，并且页码不是1，就请求上一页数据
            drivers.length === 1 && pagination.current > 1
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

    const { name, telephone, drivingPermitDueTime } = query;

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
            <FormItem label="手机号">
              {getFieldDecorator('telephone', {
                initialValue: telephone,
              })(<Input placeholder="输入手机号查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="证件到期时间">
              {getFieldDecorator('drivingPermitDueTime', {
                initialValue: drivingPermitDueTime ? moment(drivingPermitDueTime) : undefined,
              })(<DatePicker />)}
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
    const { drivers, pagination, loading } = this.props;
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
        dataIndex: 'telephone',
        align: 'center',
      },
      {
        title: '身份证号',
        dataIndex: 'identityCard',
        align: 'center',
      },
      {
        title: '车辆类型',
        dataIndex: 'carType',
        align: 'center',
      },
      {
        title: '行驶证号',
        dataIndex: 'drivingPermit',
        align: 'center',
      },
      {
        title: '车辆到期时间',
        dataIndex: 'drivingPermitDueTime',
        align: 'center',
      },
      {
        title: '审核人',
        dataIndex: 'operatorName',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        width: 140,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => router.push(`/user/drivers/${record.id}/update`)}>修改</a>
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
            rowKey="id"
            loading={loading}
            columns={tableColumns}
            data={{ list: drivers, pagination }}
            onChange={this.handleTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Audited;
