import React, { PureComponent } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon, Modal } from 'antd-mobile';
import moment from 'moment';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';

import styles from './ADSigning.less';

import qrcodeIcon from './icons/icon_qrcode@2x.png';
import addressIcon from './icons/icon_address@2x.png';

@connect(({ driverModel: { adSignings }, loading }) => ({
  adSignings,
  loading: loading.effects['driverModel/queryUserSignings'],
}))
class AdSigning extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/queryUserSignings',
    });
  }

  showQrcode = adinfo => {
    Modal.alert(
      '',
      <div className={styles.qrcodoWrap}>
        <img src={adinfo.qrcode} alt="签约二维码" />
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
  };

  render() {
    const { adSignings, loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <DocumentTitle title="签约记录">
        <div className={styles.signing}>
          {adSignings.length === 0 ? (
            <Empty />
          ) : (
            adSignings.map(item => (
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
                  <Link to={`/h5/ads/${item.adId}`}>
                    详情
                    <Icon type="right" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </DocumentTitle>
    );
  }
}

export default AdSigning;
