import React, { PureComponent, Suspense, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Card } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import { AD_PASTE_STATE_UN_REVIEW } from '@/common/constants';
import FormModal, { ACCESS_PASTE, REJECT_PASTE } from './FormModal';
import { Field } from '@/components/Charts';

const UserDetail = React.lazy(() => import('@/pages/Driver/UserDetail'));

@connect(({ driverModel: { detail }, loading }) => ({
  detail,
  loading: loading.effects['adSigningModel/queryAdSigningDetail'],
  submitting:
    loading.effects['adSigningModel/accessAdPaste'] ||
    loading.effects['adSigningModel/rejectAdPaste'],
}))
class Info extends PureComponent {
  state = {
    modalVisible: false,
    width: '100%',
    operateType: '',
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
      type: 'adSigningModel/queryAdSigningDetail',
      payload: {
        id: query.id,
      },
    });
  };

  toogleModal = operateType => {
    this.setState(({ modalVisible }) => ({
      modalVisible: !modalVisible,
      operateType: !modalVisible ? operateType : '',
    }));
  };

  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type:
        values.type === 'access' ? 'adSigningModel/accessAdPaste' : 'adSigningModel/rejectAdPaste',
      payload: {
        ...values,
      },
    }).then(success => {
      if (success) {
        // 关闭弹出
        this.toogleModal();
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
    const { width, operateType, modalVisible } = this.state;
    const { loading, detail, submitting } = this.props;

    return (
      <Fragment>
        <Suspense fallback={null}>
          <UserDetail detail={detail} loading={loading} />
        </Suspense>

        {detail.id && detail.pasteState === AD_PASTE_STATE_UN_REVIEW ? (
          <FooterToolbar style={{ width }}>
            <section style={{ textAlign: 'center' }}>
              <Button
                loading={submitting}
                icon="check-circle"
                type="primary"
                onClick={() => this.toogleModal(ACCESS_PASTE)}
              >
                粘贴
              </Button>
              <Button
                loading={submitting}
                icon="stop"
                type="danger"
                onClick={() => this.toogleModal(REJECT_PASTE)}
              >
                拒绝
              </Button>
            </section>
          </FooterToolbar>
        ) : (
          <Card title="粘贴信息" size="small" bordered={false} style={{ marginTop: 10 }}>
            <Row gutter={10}>
              <Col span={6}>
                <img src={detail.pasteImages} alt="照片" />
              </Col>
            </Row>
            <Field
              label="备注："
              value="备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注"
            />
          </Card>
        )}

        <FormModal
          operateType={operateType}
          current={detail}
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
