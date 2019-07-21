import React, { PureComponent, Suspense, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Row, Card } from 'antd';
import Zmage from 'react-zmage';
import FooterToolbar from '@/components/FooterToolbar';
import { SIGNING_GOLD_SETTLEMENT_STATE_SETTLED } from '@/common/constants';
import FormModal from './FormModal';
import { Field } from '@/components/Charts';

const UserDetail = React.lazy(() => import('@/pages/Driver/UserDetail'));

@connect(({ adSigningModel: { settleDetail }, driverModel: { detail: userInfo }, loading }) => ({
  settleDetail,
  userInfo,
  loading:
    loading.effects['adSigningModel/queryAdSettlementDetail'] ||
    loading.effects['driverModel/queryDriverDetail'],
  submitting: loading.effects['adSigningModel/doSigningSettlement'],
}))
class Info extends PureComponent {
  state = {
    modalVisible: false,
    width: '100%',
  };

  componentDidMount() {
    this.queryAdSigningDetail();
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  queryAdSigningDetail = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    dispatch({
      type: 'adSigningModel/queryAdSettlementDetail',
      payload: {
        id: query.id,
      },
    }).then(({ userId }) => {
      if (userId) {
        this.queryUserInfo(userId);
      }
    });
  };

  queryUserInfo = userId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/queryDriverDetail',
      payload: {
        id: userId,
      },
    });
  };

  toogleModal = () => {
    this.setState(({ modalVisible }) => ({
      modalVisible: !modalVisible,
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
        this.queryAdSigningDetail();
      }
    });
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  render() {
    const { width, modalVisible } = this.state;
    const { loading, settleDetail, userInfo, submitting } = this.props;

    return (
      <Fragment>
        <Suspense fallback={null}>
          <UserDetail detail={userInfo} loading={loading} />
        </Suspense>

        <Card
          loading={loading}
          title="粘贴信息"
          size="small"
          bordered={false}
          style={{ marginTop: 10 }}
        >
          <Row gutter={10}>
            {Array.isArray(settleDetail.pasteImages) &&
              settleDetail.pasteImages.map(url => (
                <Zmage
                  style={{ maxWidth: '100%', maxHeight: '200px', marginRight: 10 }}
                  src={url}
                  alt="照片"
                />
              ))}
          </Row>
          <Field label="备注：" value={settleDetail.pasteRemark} />
        </Card>

        {settleDetail.id &&
          (settleDetail.settlementState !== SIGNING_GOLD_SETTLEMENT_STATE_SETTLED ? (
            <FooterToolbar style={{ width }}>
              <section style={{ textAlign: 'center' }}>
                <Button
                  loading={submitting}
                  icon="check-circle"
                  type="primary"
                  onClick={() => this.toogleModal()}
                >
                  结算
                </Button>
                <Button loading={submitting} icon="rollback" onClick={() => router.goBack()}>
                  返回
                </Button>
              </section>
            </FooterToolbar>
          ) : (
            <Card title="结算信息" size="small" bordered={false} style={{ marginTop: 10 }}>
              <Row gutter={10}>
                {Array.isArray(settleDetail.settlementImage) &&
                  settleDetail.settlementImage.map(url => (
                    <Zmage
                      style={{ maxWidth: '100%', maxHeight: '200px', marginRight: 10 }}
                      src={url}
                      alt="照片"
                    />
                  ))}
              </Row>
              <Field label="备注：" value={settleDetail.settlementRemark} />
            </Card>
          ))}

        <FormModal
          current={settleDetail}
          confirmLoading={submitting}
          visible={modalVisible}
          onCancel={this.toogleModal}
          onSubmit={this.handleSubmit}
        />
      </Fragment>
    );
  }
}

export default Info;
