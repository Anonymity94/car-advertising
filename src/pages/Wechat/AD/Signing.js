import 'weui';
import 'react-weui/build/packages/react-weui.css';

import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import isEqual from 'lodash/isEqual';
import { Checkbox, Toast, Modal, List } from 'antd-mobile';
import { Popup, PopupHeader } from 'react-weui';

import styles from './styles.less';

const { AgreeItem } = Checkbox;

const mockDetail = {
  id: 0.5673063366855791,
  title: '广告名称广告名称广告名称广',
  company: '所属公司机构',
  banner: 'https://img.zcool.cn/community/01c22b5b596b74a801206a35e43a5e.png@1280w_1l_2o_100sh.png',
  cover: [
    'https://img.zcool.cn/community/01c22b5b596b74a801206a35e43a5e.png@1280w_1l_2o_100sh.png',
    'https://img.zcool.cn/community/01c22b5b596b74a801206a35e43a5e.png@1280w_1l_2o_100sh.png',
  ],
  clause: '/upload/ec858bac-48ce-4624-a4c8-fa09a91270b5.pdf',
  bonus: 1000,
  integral: 20,
  content:
    '<p style="color: red">广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容</p>',
  remark: '积分备注',
  address: [
    {
      address: '北京市海淀区北京市海淀区北京市海淀区北京市海淀区北京市海淀区北京市海淀区',
      beginTime: '12:43',
      endTime: '14:45',
    },
    {
      address: '北京市朝阳区',
      beginTime: '08:00',
      endTime: '10:12',
    },
  ],
  publishTime: '2019-06-19 17:59:44',
  createTime: '2019-06-19 17:59:44',
  modifyTime: '2019-06-19 17:59:44',
  isTop: 1,
  isPublish: 0,
  operator: '测试',
  visitCount: 20,
  signingCount: 340,
};

@connect(({ adModel: { detail }, loading }) => ({
  detail: mockDetail,
  queryLoading: loading.effects['adModel/queryAdContent'],
}))
class Signing extends PureComponent {
  state = {
    checked: false,

    detail: {},
    currentAddress: {},

    open: false,
  };

  async componentDidMount() {
    await this.getAdContent();
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
    const { dispatch, detail } = this.props;

    Modal.alert('确定签约吗？', '', [
      { text: '取消', onPress: () => {}, style: 'default' },
      {
        text: '确定',
        onPress: () => {
          dispatch({
            type: 'adSigningModel/doSigning',
            payload: {
              id: detail.id, // 广告id
              ...currentAddress, // 粘贴地址，粘贴时间
            },
          }).then(success => {
            if (success) {
              router.go(-2);
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
      Toast.loading('加载中....', 0);
    } else {
      Toast.hide();
    }

    return (
      <DocumentTitle title="签约详情">
        <Fragment>
          <div className={styles.signingWrap}>
            <div className={styles.signing}>
              <div className={styles.title}>
                <p>贴广告地址</p>
                <span onClick={() => this.showDrawer()}>修改</span>
              </div>
              <div className={styles.address}>{currentAddress.address}</div>

              <div className={styles.time}>
                <span className={styles.label}>工作时间</span>
                <span className={styles.value}>
                  {currentAddress.beginTime} - {currentAddress.endTime}
                </span>
              </div>
              <div className={styles.clause}>
                <AgreeItem data-seed="addressList" onChange={() => this.toogleCheck()}>
                  我已确认，并同意{' '}
                  <Link target="_blank" rel="noopener noreferer" to={detail.clause}>
                    签约条款
                  </Link>
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
            onRequestClose={() => this.setState({ open: false })}
          >
            <PopupHeader
              left="修改地址"
              right={<span className={styles.popOk}>确认</span>}
              leftOnClick={() => {}}
              rightOnClick={() => this.setState({ open: false })}
            />
            <List>
              {detail.address &&
                Array.isArray(detail.address) &&
                detail.address.map(i => (
                  <Checkbox.CheckboxItem
                    checked={currentAddress.address === i.address}
                    key={i.address}
                    onChange={() => this.setState({ currentAddress: i })}
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
