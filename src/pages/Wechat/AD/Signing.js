import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import isEqual from 'lodash/isEqual';
import { Checkbox, Modal, List, Toast } from 'antd-mobile';
import Loading from '@/components/Loading';
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import { Popup, PopupHeader } from 'react-weui';

import styles from './styles.less';
import Empty from '@/components/Empty';
import { PUBLISH_STATE_NO, PUBLISH_STATE_YES, AUDIT_STATE_PASSED } from '@/common/constants';

const { AgreeItem } = Checkbox;

@connect(({ adModel: { detail }, driverModel: { detail: userInfo }, loading }) => ({
  detail,
  userInfo,
  queryLoading: loading.effects['adModel/queryAdContent'],
  submitLoading: loading.effects['adSigningModel/doSigning'],
}))
class Signing extends PureComponent {
  state = {
    checked: false,

    detail: {},
    currentAddress: {},

    open: false,
  };

  componentDidMount() {
    this.getAdContent();
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('detail' in nextProps && !isEqual(nextProps.detail, state.detail)) {
      const { address } = nextProps.detail;
      if (!address) {
        return null;
      }
      return {
        detail: nextProps.detail,
        currentAddress: Array.isArray(address) && address.length > 0 ? address[0] : {},
      };
    }
    return null;
  }

  getAdContent = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;

    dispatch({
      type: 'adModel/queryAdContent',
      payload: {
        id: params.id,
      },
    });
  };

  toogleCheck = () => {
    this.setState(({ checked }) => ({
      checked: !checked,
    }));
  };

  showDrawer = () => {
    const {
      detail: { address },
    } = this.props;

    if (!address || !Array.isArray(address) || address.length === 0) {
      return;
    }

    this.setState(({ open }) => ({ open: !open }));
  };

  doSigning = () => {
    const { userInfo, detail, dispatch } = this.props;
    if (userInfo.status !== AUDIT_STATE_PASSED) {
      Modal.alert('无法签约', '不是正式注册会员', [
        { text: '好的', onPress: () => {}, style: 'default' },
      ]);
      return;
    }

    if (!detail.id) {
      Modal.alert('无法签约', '广告不存在或已被删除', [
        { text: '好的', onPress: () => {}, style: 'default' },
      ]);
      return;
    }
    if (detail.isPublish !== PUBLISH_STATE_YES) {
      Modal.alert('无法签约', '广告已下线', [
        { text: '好的', onPress: () => {}, style: 'default' },
      ]);
      return;
    }

    const { currentAddress, checked } = this.state;
    if (Object.keys(currentAddress).length === 0) {
      Modal.alert('请选择粘贴地址', '', [{ text: '好的', onPress: () => {}, style: 'default' }]);
      return;
    }
    if (!checked) {
      Modal.alert('请选择同意签约条款', '', [
        { text: '好的', onPress: () => {}, style: 'default' },
      ]);
      return;
    }

    Modal.alert('确定签约吗？', '', [
      { text: '取消', onPress: () => {}, style: 'default' },
      {
        text: '确定',
        onPress: () => {
          Toast.loading('提交中...', 0);
          dispatch({
            type: 'adSigningModel/doSigning',
            payload: {
              advId: detail.id, // 广告id
              ...currentAddress, // 粘贴地址，粘贴时间
            },
          }).then(success => {
            Toast.hide();
            if (success) {
              Modal.alert('签约成功', '', [
                {
                  text: '好的',
                  onPress: () => {
                    router.go(-2);
                  },
                },
              ]);
            } else {
              Modal.alert('签约失败', '', [{ text: '好的', onPress: () => {} }]);
            }
          });
        },
      },
    ]);
  };

  render() {
    const { currentAddress, checked, open } = this.state;
    const { detail, queryLoading } = this.props;

    if (queryLoading) {
      return <Loading />;
    }

    if (!detail.id) {
      return (
        <Fragment>
          <Empty text="广告不存在或已被删除" />
        </Fragment>
      );
    }

    if (detail.isPublish === PUBLISH_STATE_NO) {
      return (
        <Fragment>
          <Empty text="广告已下线" />
        </Fragment>
      );
    }

    return (
      <DocumentTitle title="签约详情">
        <Fragment>
          <div className={styles.signingWrap}>
            <div className={styles.signing}>
              <div className={styles.title}>
                <p>贴广告地址</p>
                <span onClick={() => this.showDrawer()}>修改选择地址</span>
              </div>
              <div className={styles.address}>{currentAddress.address}</div>

              <div className={styles.time}>
                <span className={styles.label}>粘贴地工作时间</span>
                <span className={styles.value}>
                  {currentAddress.beginTime} - {currentAddress.endTime}
                </span>
              </div>
              <div className={styles.clause}>
                <AgreeItem data-seed="addressList" onChange={() => this.toogleCheck()}>
                  我已确认，并同意{' '}
                  {detail.clause && (
                    <Link target="_blank" rel="noopener noreferer" to={detail.clause}>
                      签约条款
                    </Link>
                  )}
                </AgreeItem>
              </div>
            </div>
            <div className={styles.operate}>
              <div className={styles.operateItem}>
                <span className={styles.btnCancel} onClick={() => router.goBack()}>
                  取消
                </span>
              </div>
              <div className={styles.operateItem}>
                <span
                  onClick={() => this.doSigning()}
                  className={`${checked ? styles.btnOk : styles.btnCancel}`}
                >
                  确定
                </span>
              </div>
            </div>
          </div>

          <Popup
            className={styles.popupWrap}
            show={open}
            onRequestClose={() => {
              this.setState({ open: false });
              return false;
            }}
          >
            <PopupHeader
              left="修改地址"
              right={<span className={styles.popOk}>确认</span>}
              rightOnClick={() => {
                this.setState({ open: false });
                return false;
              }}
            />
            <List>
              {detail.address &&
                Array.isArray(detail.address) &&
                detail.address.map(i => (
                  <Checkbox.CheckboxItem
                    checked={currentAddress.address === i.address}
                    key={i.address}
                    onChange={() => {
                      this.setState({ currentAddress: i });
                      return false;
                    }}
                  >
                    {i.address}
                  </Checkbox.CheckboxItem>
                ))}
            </List>
          </Popup>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default Signing;
