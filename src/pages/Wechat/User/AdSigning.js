import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Link from 'umi/link';
import QRCode from 'qrcode';
import { Icon, Modal } from 'antd-mobile';
import moment from 'moment';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';

import styles from './ADSigning.less';

import qrcodeIcon from './icons/icon_qrcode@2x.png';
import addressIcon from './icons/icon_address@2x.png';
import { AD_PASTE_STATE_REFUSE, AD_PASTE_STATE_PASTED } from '@/common/constants';
import PullToRefreshWrap from '@/components/PullToRefresh';

@connect(
  ({ driverModel: { adSignings }, login: { wechatUser }, driverModel: { detail }, loading }) => ({
    adSignings,
    wechatUser,
    userDetail: detail,
    loading: loading.effects['driverModel/queryUserSignings'],
  })
)
class AdSigning extends PureComponent {
  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/queryUserSignings',
    });
  };

  showQrcode = ({ id, pasteState }) => {
    if (!id) {
      Modal.alert('无法生成签约二维码', '没有找到相关签约记录', [
        {
          text: '关闭',
          onPress: () => {},
        },
      ]);
      return;
    }

    if (pasteState === AD_PASTE_STATE_REFUSE) {
      Modal.alert('粘贴被拒绝', '无法生成签约二维码', [
        {
          text: '关闭',
          onPress: () => {},
        },
      ]);
      return;
    }
    if (pasteState === AD_PASTE_STATE_PASTED) {
      Modal.alert('广告已粘贴', '无需再次生成签约二维码', [
        {
          text: '关闭',
          onPress: () => {},
        },
      ]);
      return;
    }

    // 生成二维码信息
    QRCode.toDataURL(`${window.location.origin}/wechat/ad-signing-qrcode?id=${id}`)
      .then(url => {
        Modal.alert(
          '',
          <div className={styles.qrcodoWrap}>
            <img src={url} alt="签约二维码" />
            <p>签约二维码</p>
            <span>粘贴时，请向工作人员出示</span>
          </div>,
          [
            {
              text: '关闭',
              onPress: () => {},
            },
          ]
        );
      })
      .catch(err => {
        Modal.alert('二维码生成失败', '', [
          {
            text: '关闭',
            onPress: () => {},
          },
        ]);
        throw err;
      });
  };

  render() {
    const { adSignings, loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (adSignings.length === 0) {
      return (
        <DocumentTitle title="签约记录">
          <Empty />
        </DocumentTitle>
      );
    }

    return (
      <DocumentTitle title="签约记录">
        <Fragment>
          <PullToRefreshWrap onRefresh={() => this.getList()}>
            <div className={styles.signing}>
              {adSignings.map(item => (
                <div className={styles.card}>
                  <p className={styles.title}>{item.adTitle}</p>

                  <div className={`${styles.extra} ${styles.flex}`}>
                    <span>{moment(item.createTime).format('YYYY-MM-DD')}</span>
                    <span>{item.bonus}/月</span>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.address}>
                      <img src={addressIcon} alt="地址" /> {item.address}
                    </p>
                    <div className={`${styles.info} ${styles.flex}`}>
                      <span>工作时间</span>
                      <span>
                        {item.beginTime}-{item.endTime}
                      </span>
                    </div>
                    <div className={`${styles.info} ${styles.flex}`}>
                      <span>有效期</span>
                      <span>{item.signingExpireTime}</span>
                    </div>
                  </div>

                  <div className={`${styles.footer} ${styles.flex}`}>
                    <img src={qrcodeIcon} alt="二维码" onClick={() => this.showQrcode(item)} />
                    <Link to={`/h5/ads/${item.advId}`}>
                      详情
                      <Icon type="right" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </PullToRefreshWrap>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default AdSigning;
