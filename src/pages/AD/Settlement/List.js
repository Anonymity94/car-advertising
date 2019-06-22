import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import { Card, Divider, Form, Row, Col, Input, Button, Icon, DatePicker, Select } from 'antd';
import { handleSearch, handleSearchReset, handleFilterResult } from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import FormModal from './FormModal';
import { SIGNING_GOLD_SETTLEMENT_STATE_LIST } from '@/common/constants';

const FormItem = Form.Item;

@Form.create()
@connect(({ adSigningModel: { list }, loading }) => ({
  list,
  loading: loading.effects['adSigningModel/queryAdSettlements'],
  submitLoading: loading.effects['adSigningModel/doSigningSettlement'],
}))
class AdPasteList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,

      current: {}, // 当前操作的签约记录

      // eslint-disable-next-line react/no-unused-state
      search: {},

      filterResult: props.list,
    };

    this.handleSearchReset = handleSearchReset.bind(this);
    this.handleSearch = handleSearch.bind(this);
    this.handleFilterResult = handleFilterResult.bind(this);
  }

  componentDidMount() {
    this.queryAdSettlements();
  }

  componentWillUnmount() {}

  queryAdSettlements = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adSigningModel/queryAdSettlements',
    });
  };

  toogleModal = current => {
    this.setState(({ modalVisible }) => ({
      modalVisible: !modalVisible,
      current: current || {},
    }));
  };

  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adSigningModel/doSigningSettlement',
      payload: {
        ...values,
      },
    }).then(success => {
      if (success) {
        // 关闭弹出
        this.toogleModal();
        // 重新拉取表格
        this.queryAdSettlements();
      }
    });
  };

  renderSearchForm = () => {
    const {
      form: { getFieldDecorator },
      location: { query },
    } = this.props;

    const { name, settlementTime, settlementState } = query;

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
            <FormItem label="结算日期">
              {getFieldDecorator('settlementTime', {
                initialValue: settlementTime ? moment(settlementTime) : undefined,
              })(
                <DatePicker disabledDate={current => current && current > moment().endOf('day')} />
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="状态">
              {getFieldDecorator('settlementState', {
                initialValue: settlementState,
              })(
                <Select placeholder="请选择结算状态">
                  <Select.Option key="" value="">
                    全部
                  </Select.Option>
                  {SIGNING_GOLD_SETTLEMENT_STATE_LIST.map(item => (
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
  };

  render() {
    const { modalVisible, current, filterResult } = this.state;
    const { loading, submitLoading } = this.props;

    const tableColumns = [
      {
        title: '会员编号',
        dataIndex: 'userId',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'fullname',
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
        title: '车辆类型',
        dataIndex: 'carType',
        align: 'center',
      },
      {
        title: '行驶证号',
        dataIndex: 'carCode',
        align: 'center',
      },
      {
        title: '证件到期时间',
        dataIndex: 'expireTime',
        align: 'center',
      },
      {
        title: '粘贴日期',
        dataIndex: 'pasteTime',
        align: 'center',
      },
      {
        title: '签约金额',
        dataIndex: 'bonus',
        align: 'center',
      },
      {
        title: '签约有效期',
        dataIndex: 'signingExpireTime',
        align: 'center',
      },
      {
        title: '结算日期',
        dataIndex: 'settlementTime',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'settlementState',
        align: 'center',
      },
      {
        title: '审核人',
        dataIndex: 'settlementPerson',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        width: 140,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.toogleModal(record)}>结算</a>
            <Divider type="vertical" />
            <Link to={`/application/ad-signings/settlement/detail?id=${record.id}`}>详情</Link>
          </Fragment>
        ),
      },
    ];

    return (
      <Fragment>
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
          <StandardTable
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
      </Fragment>
    );
  }
}

export default AdPasteList;
