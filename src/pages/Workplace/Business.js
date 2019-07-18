/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Avatar, Icon, Button, Form, Modal, Input, InputNumber } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from './Business.less';
import { phoneReg } from '@/utils/utils';
import { BOOLEAN_YES } from '@/common/constants';

const MODEL_TYPE_EXCHANGE = 'exchange';
const MODEL_TYPE_SETTLEMENT = 'settlement';

const tableColumns = [
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
    title: '兑换物品',
    dataIndex: 'goodsName',
    align: 'center',
    render: (text, record) => `${record.businessName}-${text}`,
  },
  {
    title: '所获积分',
    dataIndex: 'integral',
    align: 'center',
  },
  {
    title: '兑换日期',
    dataIndex: 'settlementTime',
    align: 'center',
    // render: text => text && moment(text).format('YYYY-MM-DD'),
  },
  // {
  //   title: '审核人',
  //   dataIndex: 'operator',
  //   align: 'center',
  // },
];

const ModalForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      exchangeDetail: {},
    };

    queryExchangeDetail = () => {
      const { dispatch, form } = this.props;
      const exchangeCode = form.getFieldValue('exchangeCode');
      if (!exchangeCode) return;

      dispatch({
        type: 'goodsExchangeModel/queryExchangeDetail',
        payload: {
          exchangeCode,
        },
      }).then(result => {
        this.setState({
          exchangeDetail: result,
        });
      });
    };

    handleIntegralChange = value => {
      const { form } = this.props;
      form.setFieldsValue({
        money: value,
      });
    };

    onOk = () => {
      const { form, onSubmit } = this.props;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }

        if (onSubmit) {
          onSubmit(values);
        }
      });
    };

    render() {
      const { exchangeDetail } = this.state;
      const { visible, onCancel, form, type, currentUser, loading } = this.props;
      const { getFieldDecorator } = form;

      // 剩余可用积分
      const restIntegral = currentUser.restIntegral || 0;

      return (
        <Modal
          visible={visible}
          title={type === MODEL_TYPE_EXCHANGE ? '兑换' : '提现'}
          destroyOnClose
          confirmLoading={loading}
          onCancel={onCancel}
          onOk={this.onOk}
          okButtonProps={{
            disabled:
              type === MODEL_TYPE_EXCHANGE &&
              (!exchangeDetail.id || exchangeDetail.state === BOOLEAN_YES),
          }}
        >
          <Form labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
            {type === MODEL_TYPE_EXCHANGE && (
              <Fragment>
                <Form.Item label="兑换码">
                  <Row gutter={10}>
                    <Col span={20}>
                      {getFieldDecorator('exchangeCode', {
                        rules: [{ required: true, message: '请输入兑换码' }],
                      })(<Input onBlur={() => this.setState({ exchangeDetail: {} })} />)}
                    </Col>
                    <Col span={4}>
                      <Button type="primary" onClick={this.queryExchangeDetail}>
                        查找
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
                {exchangeDetail.state === BOOLEAN_YES ? (
                  <h3 style={{ color: 'red', textAlign: 'center' }}>已兑换</h3>
                ) : (
                  <Fragment>
                    <Form.Item style={{ marginBottom: 0 }} label="姓名">
                      {exchangeDetail.username || '--'}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} label="手机号码">
                      {exchangeDetail.phone || '--'}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} label="兑换商品">
                      {exchangeDetail.goodsName || '--'}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} label="积分数">
                      {exchangeDetail.integral || '--'}
                    </Form.Item>
                  </Fragment>
                )}
              </Fragment>
            )}
            {type === MODEL_TYPE_SETTLEMENT && (
              <Fragment>
                <Form.Item label="名称">
                  {getFieldDecorator('businessName', {
                    initialValue: currentUser.username,
                  })(<Input readOnly />)}
                </Form.Item>
                <Form.Item label="积分数" extra={`剩余可用积分：${restIntegral}`}>
                  {getFieldDecorator('integral', {
                    validateFirst: true,
                    rules: [
                      { required: true, message: '请输入积分' },
                      { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
                      {
                        validator: (rule, value, callback) => {
                          if (value > restIntegral) {
                            callback(`剩余可用积分：${restIntegral}`);
                          } else {
                            callback();
                          }
                        },
                      },
                    ],
                  })(
                    <InputNumber style={{ width: '100%' }} onChange={this.handleIntegralChange} />
                  )}
                </Form.Item>
                <Form.Item label="金额数" extra="输入积分后自动生成，不可修改">
                  {getFieldDecorator('money', {
                    rules: [{ required: true, message: '请输入金额数' }],
                  })(<InputNumber readOnly style={{ width: '100%' }} />)}
                </Form.Item>
                <Form.Item label="手机号">
                  {getFieldDecorator('telephone', {
                    validateFirst: true,
                    rules: [
                      { required: true, message: '请输入手机号' },
                      {
                        pattern: phoneReg,
                        message: '请输入正确的手机号',
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                {type === MODEL_TYPE_SETTLEMENT && (
                  <p style={{ color: 'red', textAlign: 'center', marginBottom: 0 }}>
                    提现请求发起后，工作人员将与x天内联系您。
                    <br />
                    请保持手机畅通！
                  </p>
                )}
              </Fragment>
            )}
          </Form>
        </Modal>
      );
    }
  }
);

// eslint-disable-next-line react/no-multi-comp
@Form.create()
@connect(({ goodsExchangeModel: { goodsExchangeLogs }, login: { currentUser }, loading }) => ({
  goodsExchangeLogs,
  currentUser,
  loading,
  submitLoading:
    loading.effects['goodsExchangeModel/auditExchange'] ||
    loading.effects['businessModel/startIntegralSettlement'],
}))
class Workplace extends PureComponent {
  state = {
    modalType: '',
    visible: false,
  };

  componentDidMount() {
    this.queryGoodsExchangeLogs();
  }

  componentWillUnmount() {}

  showModal = modalType => {
    this.setState({ visible: true, modalType });
  };

  handleCancel = () => {
    this.setState({ visible: false, modalType: '' });
  };

  handleSubmit = values => {
    const { modalType } = this.state;
    if (modalType === MODEL_TYPE_EXCHANGE) {
      this.auditGoodsExchange(values);
    } else if (modalType === MODEL_TYPE_SETTLEMENT) {
      this.startIntegralSettlement(values);
    }
  };

  queryCurrent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/queryLoggedUser',
    });
  };

  /**
   * 查询某个商户下商品兑换情况
   */
  queryGoodsExchangeLogs = () => {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'goodsExchangeModel/queryExchangeLogs',
      payload: {
        businessId: currentUser.id,
      },
    });
  };

  /**
   * 某个商户根据兑换码给用户兑换商品
   */
  auditGoodsExchange = ({ exchangeCode }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsExchangeModel/auditExchange',
      payload: {
        exchangeCode,
      },
    }).then(success => {
      if (success) {
        this.setState({ visible: false });
        this.queryCurrent();
        this.queryGoodsExchangeLogs();
      }
    });
  };

  startIntegralSettlement = values => {
    const { dispatch, currentUser } = this.props;

    dispatch({
      type: 'businessModel/startIntegralSettlement',
      payload: {
        id: currentUser.id,
        ...values,
      },
    }).then(success => {
      if (success) {
        this.setState({ visible: false });
        this.queryCurrent();
      }
    });
  };

  render() {
    const { visible, modalType } = this.state;
    const { loading, dispatch, currentUser, goodsExchangeLogs, submitLoading } = this.props;
    return (
      <Fragment>
        <Card size="small" bordered={false} style={{ marginBottom: 20 }}>
          <Row gutter={10}>
            <Col sm={24} md={5} className={styles.avatar}>
              <div>
                <Avatar style={{ verticalAlign: 'middle' }} size="large">
                  {currentUser.username}
                </Avatar>
              </div>
              <p className={styles.title}>{currentUser.username}</p>
            </Col>
            <Col sm={24} md={7} style={{ textAlign: 'center' }}>
              <p className={styles.label}>已服务客户</p>
              <p className={styles.value}>{goodsExchangeLogs.length}人</p>
            </Col>
            <Col sm={24} md={5} style={{ textAlign: 'center' }}>
              <p className={styles.label}>可提现积分</p>
              <p className={styles.value}>
                <div className={styles.red}>
                  <span>{currentUser.restIntegral || 0}</span>
                  <Icon type="arrow-right" />
                  <span>{currentUser.restIntegral || 0}元</span>
                </div>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => this.showModal(MODEL_TYPE_SETTLEMENT)}
                >
                  提现
                </Button>
              </p>
            </Col>
            <Col sm={24} md={7} style={{ textAlign: 'center' }}>
              <p className={styles.label}>已提现积分</p>
              <p className={styles.value}>{currentUser.usedIntegral || 0}</p>
            </Col>
          </Row>
        </Card>
        <Card
          title="已兑换客户"
          size="small"
          bordered={false}
          className={styles.todosList}
          extra={
            <Button type="primary" onClick={() => this.showModal(MODEL_TYPE_EXCHANGE)}>
              兑换
            </Button>
          }
        >
          <StandardTable
            rowKey="id"
            loading={loading.effects['goodsExchangeModel/queryExchangeLogs']}
            columns={tableColumns}
            data={{ list: goodsExchangeLogs }}
          />
        </Card>

        {visible && (
          <ModalForm
            wrappedComponentRef={this.saveFormRef}
            visible={visible}
            currentUser={currentUser}
            loading={submitLoading}
            type={modalType}
            dispatch={dispatch}
            onCancel={this.handleCancel}
            onSubmit={this.handleSubmit}
          />
        )}
      </Fragment>
    );
  }
}

export default Workplace;
