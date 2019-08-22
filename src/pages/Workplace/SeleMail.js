import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Tabs, Col, Input, Button, List, Modal, Divider, Row, message } from 'antd';
import { Field } from '@/components/Charts';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './SeleMail.less';
import {
  BOOLEAN_YES,
  EXCHANGE_CANCEL_APPROVE,
  EXCHANGE_CANCEL_WAITING,
  EXCHANGE_CANCEL_REFUSE,
} from '@/common/constants';

const { TabPane } = Tabs;

const colProps = {
  lg: { span: 24 },
  xl: { span: 12 },
  style: { marginBottom: 6 },
};

@Form.create()
@connect(({ goodsExchangeModel, login: { currentUser }, loading }) => ({
  goodsExchangeModel,
  currentUser,
  loading: loading.effects['goodsExchangeModel/queryExchangeLogs'],
}))
class SeleMailManager extends PureComponent {
  state = {
    driverDetail: {},
  };

  componentDidMount() {
    this.queryGoodsExchangeLogs();
  }

  queryCurrent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/queryLoggedUser',
    });
  };

  queryDriverDetail = userId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/queryDriverDetail',
      payload: {
        id: userId,
      },
    }).then(detail => {
      this.setState({ driverDetail: detail });
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

  renderUnpaidItem = item => (
    <section className={styles.unpaidList}>
      <Row>
        <Col {...colProps}>
          <Field label="名称:" value={item.recvName} />
        </Col>
        <Col {...colProps}>
          <Field label="手机号:" value={item.recvPhone} />
        </Col>
        <Col {...colProps}>
          <Field label="收货人:" value={item.recvName || '--'} />
        </Col>
        <Col {...colProps}>
          <Field label={<span>收货人手机:</span>} value={item.recvPhone || '--'} />
        </Col>
        <Col {...colProps}>
          <Field label="兑换商品:" value={item.goodsName} />
        </Col>
        <Col {...colProps}>
          <Field label="兑换数量:" value={item.count} />
        </Col>
        <Col {...colProps}>
          <Field label="乐蚁果数:" value={(item.count || 1) * item.integral} />
        </Col>
        <Col />
        <Col {...colProps}>
          <Field
            label="日期:"
            value={item.createTime ? moment(item.createTime).format('YYYY-MM-DD') : '--'}
          />
        </Col>
        <Col span={24}>详细地址：{item.address || '--'}</Col>
      </Row>
    </section>
  );

  doSendMail = ({ id, ...reset }) => {
    const { dispatch, currentUser } = this.props;
    Modal.confirm({
      width: 660,
      title: `确定邮寄吗？`,
      content: <Fragment>{this.renderUnpaidItem(reset)}</Fragment>,
      keyboard: false,
      maskClosable: false,
      onOk: () => {
        dispatch({
          type: 'goodsExchangeModel/updateExchangeLog',
          payload: {
            id,
            state: BOOLEAN_YES,
            settlementTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          },
        }).then(success => {
          if (success) {
            message.success('邮寄完成');
            // 更新商户自己的积分情况
            // 更新商户的乐蚁果
            const { id: businessId, restIntegral = 0, usedIntegral = 0 } = currentUser;
            const count = reset.count || 1;
            const { integral } = reset;
            const costIntegral = count * integral;

            // 更新商户的乐蚁果
            this.updateBussIntegral({
              id: businessId,
              restIntegral: restIntegral + costIntegral,
              usedIntegral,
            });

            this.queryGoodsExchangeLogs();
          } else {
            message.error('邮寄失败');
          }
        });
      },
    });
  };

  handleGiveback = (record, newCancelState) => {
    const { dispatch } = this.props;

    const { id } = record;

    if (!id) return;

    let confirmModal = null;

    const doUpdate = remark => {
      confirmModal.update({
        okButtonProps: {
          loading: true,
        },
      });
      dispatch({
        type: 'goodsExchangeModel/updateExchangeLog',
        payload: {
          id,
          cancelState: newCancelState,
          remark,
        },
      }).then(success => {
        if (success) {
          Modal.destroyAll();
          // 如果是拒绝退还，无需操作乐蚁果
          // 如果是同意退还，需要处理乐蚁果
          if (newCancelState === EXCHANGE_CANCEL_APPROVE) {
            // 更新商户的乐蚁果
            const { id: businessId, restIntegral = 0, usedIntegral = 0 } = currentUser;
            const count = record.count || 1;
            const { integral } = record;
            const costIntegral = count * integral;
            // TODO:

            // -------------
            this.queryDriverDetail(record.userId);
            // 获取当前司机的信息
            setTimeout(() => {
              const { driverDetail } = this.state;
              const { restIntegral = 0, usedIntegral = 0 } = driverDetail;
              // TODO:
            }, 0);
          }
        } else {
          confirmModal.update({
            okButtonProps: {
              loading: false,
            },
          });
        }
      });
    };

    const confirmProps = {
      maskClosable: false,
      destroyOnClose: true,
      keyboard: false,
      okText: '确定',
      cancelText: '取消',
      autoFocusButton: true,
      loading: false,
    };

    if (newCancelState === EXCHANGE_CANCEL_APPROVE) {
      confirmModal = Modal.confirm({
        title: '确定同意退还吗？',
        ...confirmProps,
        onOk: () => {
          doUpdate();
          return Promise.reject();
        },
        onCancel: () => {},
      });
    } else {
      let remark = '';
      confirmModal = Modal.confirm({
        title: '确定拒绝退还吗？',
        ...confirmProps,
        content: (
          <Fragment>
            <div style={{ marginBottom: 10 }}>拒绝理由：</div>
            <Input.TextArea
              required
              autoFocus
              maxLength={512}
              ref={input => {
                this.reasonInput = input;
              }}
              placeholder="请输入拒绝退还的原因！"
            />
          </Fragment>
        ),
        onOk: () => {
          remark = this.reasonInput.textAreaRef.value;
          if (!remark) {
            return Promise.reject();
          }
          doUpdate(remark);
          return true;
        },
      });
    }
  };

  // 更新商户的乐蚁果
  updateBussIntegral = ({ id, restIntegral, usedIntegral }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessModel/updateIntegral',
      payload: {
        id,
        restIntegral,
        usedIntegral,
      },
    }).then(() => {
      // 刷新乐蚁果后，重新拉取一边用户乐蚁果情况
      this.queryCurrent();
    });
  };

  // 更新用户的乐蚁果
  updateDriverIntegral = ({ id, restIntegral, usedIntegral }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/updateDriverIntegral',
      payload: {
        id,
        restIntegral,
        usedIntegral,
      },
    });
  };

  render() {
    const { loading, goodsExchangeModel } = this.props;
    const {
      tobeMailedLogs,
      tobeGivebackLogs,
      givebackFinishLogs,
      mailedFinishLogs,
    } = goodsExchangeModel;

    const finishedColumns = [
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
        render: (text, record) => (
          <div style={{ textAlign: 'left' }}>
            <div>用户：{record.username}</div>
            <div>收货人：{record.recvName}</div>
          </div>
        ),
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        align: 'center',
        width: 200,
        render: (text, record) => (
          <div style={{ textAlign: 'left' }}>
            <div>手机号：{record.phone}</div>
            <div>收货人手机：{record.recvPhone}</div>
          </div>
        ),
      },
      {
        title: '兑换物品',
        dataIndex: 'goodsName',
        align: 'center',
        render: (goodsName, record) => `${record.businessName}-${goodsName}`,
      },
      {
        title: '兑换数量',
        dataIndex: 'count',
        align: 'center',
        render: text => text || 1,
      },
      {
        title: '乐蚁果数',
        dataIndex: 'integral',
        align: 'center',
        render: (integral, record) => {
          const count = record.count || 1;
          return `${integral * count}（${count}个 * ${integral}）`;
        },
      },
      {
        title: '地址',
        dataIndex: 'address',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'state',
        align: 'center',
        render: state => (state === BOOLEAN_YES ? '已邮寄' : '未邮寄'),
      },
    ];

    const fivebackColumns = [
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
        render: (text, record) => (
          <div style={{ textAlign: 'left' }}>
            <div>用户：{record.username}</div>
            <div>收货人：{record.recvName}</div>
          </div>
        ),
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        align: 'center',
        width: 200,
        render: (text, record) => (
          <div style={{ textAlign: 'left' }}>
            <div>手机号：{record.phone}</div>
            <div>收货人手机：{record.recvPhone}</div>
          </div>
        ),
      },
      {
        title: '兑换物品',
        dataIndex: 'goodsName',
        align: 'center',
        render: (goodsName, record) => `${record.businessName}-${goodsName}`,
      },
      {
        title: '兑换数量',
        dataIndex: 'count',
        align: 'center',
        render: text => text || 1,
      },
      {
        title: '退还乐蚁果数',
        dataIndex: 'integral',
        align: 'center',
        render: (integral, record) => {
          const count = record.count || 1;
          return `${integral * count}（${count}个 * ${integral}）`;
        },
      },
      {
        title: '退还原因',
        dataIndex: 'reason',
        align: 'center',
      },
      {
        title: '退还日期',
        dataIndex: 'verifyTime',
        align: 'center',
        render: verifyTime => (verifyTime ? moment(verifyTime).format('YYYY-MM-DD') : '无'),
      },
      {
        title: '是否邮寄',
        dataIndex: 'state',
        align: 'center',
        render: state => (state === BOOLEAN_YES ? '是' : '否'),
      },
      {
        title: '状态',
        dataIndex: 'cancelState',
        align: 'center',
        render: cancelState => {
          if (cancelState === EXCHANGE_CANCEL_APPROVE) return '已退还';
          if (cancelState === EXCHANGE_CANCEL_WAITING) return '未退还';
          if (cancelState === EXCHANGE_CANCEL_REFUSE) return '退还已拒绝';
          return '--';
        },
      },
    ];

    const operate = [
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        width: 90,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleGiveback(record, EXCHANGE_CANCEL_APPROVE)}>退还</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleGiveback(record, EXCHANGE_CANCEL_REFUSE)}>拒绝</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card size="small" bordered={false} title="待邮寄商品" style={{ marginBottom: 10 }}>
          <List
            grid={{ gutter: 10, column: 3 }}
            dataSource={tobeMailedLogs}
            pagination={{
              pageSize: 12,
            }}
            loading={loading}
            renderItem={item => (
              <List.Item>
                <Card size="small">
                  {this.renderUnpaidItem(item)}
                  <Button
                    className={styles.settlementBtn}
                    type="primary"
                    onClick={() => this.doSendMail(item)}
                  >
                    邮寄
                  </Button>
                </Card>
              </List.Item>
            )}
          />
        </Card>
        <Card bodyStyle={{ padding: 0 }} bordered={false}>
          <Tabs defaultActiveKey="1" animated={false}>
            <TabPane tab="待退还乐蚁果" key="1">
              <StandardTable
                rowKey="id"
                loading={loading}
                columns={[...fivebackColumns, ...operate]}
                data={{ list: tobeGivebackLogs }}
              />
            </TabPane>
            <TabPane tab="已邮寄商品" key="2">
              <StandardTable
                rowKey="id"
                loading={loading}
                columns={finishedColumns}
                data={{ list: mailedFinishLogs }}
              />
            </TabPane>
            <TabPane tab="已退还乐蚁果" key="3">
              <StandardTable
                rowKey="id"
                loading={loading}
                columns={fivebackColumns}
                data={{ list: givebackFinishLogs }}
              />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SeleMailManager;
