import React, { PureComponent, Suspense, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Card, Tag } from 'antd';
import Zmage from 'react-zmage';
import FooterToolbar from '@/components/FooterToolbar';
import {
  AD_PASTE_STATE_UN_REVIEW,
  AD_PASTE_STATE_PASTED,
  AD_PASTE_STATE_REFUSE,
  AD_PASTE_STATE_UN_PASTED,
} from '@/common/constants';
import FormModal, { ACCESS_PASTE, REJECT_PASTE } from './FormModal';
import { Field } from '@/components/Charts';

const UserDetail = React.lazy(() => import('@/pages/Driver/UserDetail'));

@connect(({ adSigningModel: { detail }, driverModel: { detail: userInfo }, loading }) => ({
  detail,
  userInfo,
  loading:
    loading.effects['adSigningModel/queryAdSigningDetail'] ||
    loading.effects['driverModel/queryDriverDetail'],
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

  toogleModal = operateType => {
    this.setState(({ modalVisible }) => ({
      modalVisible: !modalVisible,
      operateType,
    }));
  };

  handleSubmit = values => {
    const { operateType } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type:
        operateType === ACCESS_PASTE
          ? 'adSigningModel/accessAdPaste'
          : 'adSigningModel/rejectAdPaste',
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
    const { loading, detail, userInfo, submitting } = this.props;

    return (
      <Fragment>
        <Suspense fallback={null}>
          <UserDetail detail={userInfo} loading={loading} />
        </Suspense>

        {detail.id &&
          (!detail.pasteState ||
          detail.pasteState === AD_PASTE_STATE_UN_REVIEW ||
          detail.pasteState === AD_PASTE_STATE_UN_PASTED ? (
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
            <Card
              title={
                <span>
                  <span style={{ marginRight: 10 }}>粘贴信息</span>
                  {detail.pasteState === AD_PASTE_STATE_PASTED && <Tag color="#87d068">已粘贴</Tag>}
                  {detail.pasteState === AD_PASTE_STATE_REFUSE && <Tag color="#f50">拒绝粘贴</Tag>}
                </span>
              }
              size="small"
              bordered={false}
              style={{ marginTop: 10 }}
            >
              <Row gutter={10} style={{ marginBottom: 10 }}>
                {Array.isArray(detail.pasteImages) &&
                  detail.pasteImages.map(url => (
                    <Zmage
                      style={{ maxWidth: '100%', maxHeight: '200px', marginRight: 10 }}
                      src={url}
                      alt="照片"
                    />
                  ))}
              </Row>
              <Field label="备注：" value={detail.pasteRemark} />
            </Card>
          ))}

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
