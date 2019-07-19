import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { List } from 'antd-mobile';
import { connect } from 'dva';
import QRCode from 'qrcode';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import { AD_PASTE_STATE_PASTED, AD_PASTE_STATE_REFUSE } from '@/common/constants';
import { Tag } from 'antd';

import styles from './ADSigning.less';

@connect(
  ({
    adSigningModel: { detail: signingDetail },
    adModel: { detail: adDetail },
    driverModel: { detail: userDetail },
    loading,
  }) => ({
    signingDetail,
    adDetail,
    userDetail,
    loading:
      loading.effects['adSigningModel/queryAdSigningDetail'] ||
      loading.effects['adModel/queryAdContent'],
  })
)
class SigningDetail extends PureComponent {
  componentDidMount() {
    this.queryAdSigningDetail();
  }

  queryAdSigningDetail = () => {
    const { dispatch, match } = this.props;
    const { id } = match.params;
    // 查签约记录
    dispatch({
      type: 'adSigningModel/queryAdSigningDetail',
      payload: {
        id,
      },
    }).then(({ id: adId }) => {
      // 查广告详情
      if (adId) {
        this.queryAdContent(adId);
      }
    });
  };

  queryAdContent = adId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adModel/queryAdContent',
      payload: {
        id: adId,
      },
    });
  };

  render() {
    const { loading, signingDetail, adDetail } = this.props;
    if (loading) {
      return <Loading />;
    }

    if (!signingDetail.id) {
      return (
        <Fragment>
          <Empty text="签约不存在" />
        </Fragment>
      );
    }

    const isNot =
      signingDetail.pasteState !== AD_PASTE_STATE_REFUSE &&
      signingDetail.pasteState !== AD_PASTE_STATE_PASTED;

    const { userDetail } = this.props;
    // 生成二维码信息
    // 会员编号、姓名、手机号、身份证号、车辆类型、行驶证号、证件到期时间、签约金额以及上传的身份证和车辆照片信息
    const qrcodeContent = {
      id: userDetail.id,
      username: userDetail.username,
      phone: userDetail.phone,
      idcard: userDetail.idcard,
      carType: userDetail.carType,
      carCode: userDetail.carCode,
      expireTime: userDetail.expireTime,
      bonus: signingDetail.bonus,
      carImage: userDetail.carImage,
      idcardBackImage: userDetail.idcardBackImage,
      idcardFrontImage: userDetail.idcardFrontImage,
    };

    const qrCodeText = QRCode.toDataURL(JSON.stringify(qrcodeContent)) // 生成二维码信息
      .then(url => (
        <div className={styles.qrcodoWrap}>
          <img src={url} alt="签约二维码" />
          <p>签约二维码</p>
          <span>粘贴时，请向工作人员出示</span>
        </div>
      ))
      .catch(err => (
        <div className={styles.qrcodoWrap}>
          <p>二维码生成异常</p>
        </div>
      ));

    return (
      <DocumentTitle title="签约详情">
        <Fragment>
          <List renderHeader={() => '签约二维码'} className="my-list">
            <List.Item wrap>{qrCodeText}</List.Item>
          </List>

          <List renderHeader={() => '广告'} className="my-list">
            <List.Item wrap>{adDetail.title}</List.Item>
          </List>
          <List renderHeader={() => '签约金额'} className="my-list">
            <List.Item wrap>{signingDetail.bonus}元/月</List.Item>
          </List>

          <List renderHeader={() => '签约有效期'} className="my-list">
            <List.Item wrap>{signingDetail.signingExpireTime}</List.Item>
          </List>
          <List renderHeader={() => '粘贴地点'} className="my-list">
            <List.Item wrap>{signingDetail.address}</List.Item>
          </List>
          <List renderHeader={() => '粘贴时间'} className="my-list">
            <List.Item wrap>
              {signingDetail.beginTime} - {signingDetail.endTime}
            </List.Item>
          </List>
          <List renderHeader={() => '审核状态'} className="my-list">
            <List.Item wrap>
              {signingDetail.pasteState === AD_PASTE_STATE_PASTED && (
                <Tag color="#87d068">已粘贴</Tag>
              )}
              {signingDetail.pasteState === AD_PASTE_STATE_REFUSE && (
                <Tag color="#f50">拒绝粘贴</Tag>
              )}
              {isNot && '未粘贴'}
            </List.Item>
          </List>
          {!isNot && (
            <List renderHeader={() => '备注'} className="my-list">
              <List.Item wrap>
                操作人：{signingDetail.pastePerson}
                <br />
                备注：{signingDetail.pasteRemark}
              </List.Item>
            </List>
          )}
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default SigningDetail;
