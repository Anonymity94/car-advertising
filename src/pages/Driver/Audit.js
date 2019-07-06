import React, { PureComponent, Suspense, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Modal, Input, Empty } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import router from 'umi/router';
import UserDetail from './UserDetail';
import { AUDIT_STATE_UNREVIEWED, AUDIT_STATE_PASSED, AUDIT_STATE_REFUSE } from '@/common/constants';

import styles from './styles.less';

@connect(({ driverModel: { detail }, loading }) => ({
  detail,
  loading: loading.effects['driverModel/queryDriverDetail'],
  submitting: loading.effects['driverModel/auditDriver'],
}))
class Audit extends PureComponent {
  state = {
    width: '100%',
  };

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: 'driverModel/queryDriverDetail',
      payload: {
        id: params.id,
      },
    });
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

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

  handleAudit = status => {
    const {
      dispatch,
      detail: { id },
    } = this.props;

    if (!id) return;

    let confirmModal = null;

    const doUpdate = reason => {
      confirmModal.update({
        okButtonProps: {
          loading: true,
        },
      });
      dispatch({
        type: 'driverModel/auditDriver',
        payload: {
          id,
          status,
          reason,
        },
      }).then(success => {
        if (success) {
          Modal.destroyAll();
          router.goBack();
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

    if (status === AUDIT_STATE_PASSED) {
      confirmModal = Modal.confirm({
        title: '确定通过此条申请吗？',
        ...confirmProps,
        onOk: () => {
          doUpdate();
          return Promise.reject();
        },
        onCancel: () => {},
      });
    } else {
      let reason = '';
      confirmModal = Modal.confirm({
        title: '确定驳回此条申请吗？',
        ...confirmProps,
        content: (
          <Fragment>
            <div style={{ marginBottom: 10 }}>提交理由：</div>
            <Input.TextArea
              required
              autoFocus
              maxLength={512}
              ref={input => {
                this.reasonInput = input;
              }}
              placeholder="请输入审核注册会员未通过的原因！"
            />
          </Fragment>
        ),
        onOk: () => {
          reason = this.reasonInput.textAreaRef.value;
          if (!reason) {
            return Promise.reject();
          }
          doUpdate(reason);
          return true;
        },
      });
    }
  };

  render() {
    const { width } = this.state;
    const { loading, detail, submitting } = this.props;

    if (!loading && !detail.id) {
      return <Empty description="用户不存在或已被删除" />;
    }

    return (
      <PageHeaderWrapper showback>
        <Suspense fallback={null}>
          <UserDetail detail={detail} loading={loading} />
        </Suspense>

        {detail.id && (!detail.status || detail.status === AUDIT_STATE_UNREVIEWED) && (
          <FooterToolbar style={{ width }}>
            <section className={styles.operateWrap}>
              <Button
                loading={submitting}
                icon="check-circle"
                type="primary"
                onClick={() => this.handleAudit(AUDIT_STATE_PASSED)}
              >
                通过
              </Button>
              <Button
                loading={submitting}
                icon="stop"
                type="danger"
                onClick={() => this.handleAudit(AUDIT_STATE_REFUSE)}
              >
                未通过
              </Button>
            </section>
          </FooterToolbar>
        )}
      </PageHeaderWrapper>
    );
  }
}

export default Audit;
