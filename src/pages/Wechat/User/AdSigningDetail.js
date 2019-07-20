import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { List, Modal, Flex } from 'antd-mobile';
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
    }).then(({ id: signingId, advId }) => {
      // 查广告详情
      if (signingId && advId) {
        this.queryAdContent(advId);
      }
    });
  };

  queryAdContent = advId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adModel/queryAdContent',
      payload: {
        id: advId,
      },
    });
  };

  showQrcode = () => {
    const { userDetail, signingDetail } = this.props;
    const { bonus, status } = signingDetail;

    if (status === AD_PASTE_STATE_REFUSE) {
      Modal.alert('粘贴被拒绝', '无法生成签约二维码', [
        {
          text: '关闭',
          onPress: () => {},
        },
      ]);
      return;
    }

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
      bonus,
      carImage: userDetail.carImage,
      idcardBackImage: userDetail.idcardBackImage,
      idcardFrontImage: userDetail.idcardFrontImage,
    };

    // 生成二维码信息
    QRCode.toDataURL(JSON.stringify(qrcodeContent))
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

    return (
      <DocumentTitle title="签约详情">
        <Fragment>
          <div className={styles.signingDetail}>
            <List renderHeader={() => '审核状态'}>
              <List.Item
                extra={isNot ? '粘贴二维码' : null}
                arrow={isNot ? 'horizontal' : ''}
                onClick={isNot ? () => this.showQrcode() : () => null}
              >
                {signingDetail.pasteState === AD_PASTE_STATE_PASTED && (
                  <Tag color="#87d068">已粘贴</Tag>
                )}
                {signingDetail.pasteState === AD_PASTE_STATE_REFUSE && (
                  <Tag color="#f50">拒绝粘贴</Tag>
                )}
                {isNot && '未粘贴'}
              </List.Item>
            </List>

            <List renderHeader={() => '广告'}>
              <List.Item wrap>{`【${adDetail.company}】${adDetail.title}`}</List.Item>
            </List>
            <List renderHeader={() => '签约金额'}>
              <List.Item wrap>{signingDetail.bonus}元/月</List.Item>
            </List>
            <List renderHeader={() => '签约时间'}>
              <List.Item wrap>{signingDetail.createTime}</List.Item>
            </List>
            <List renderHeader={() => '签约有效期'}>
              <List.Item wrap>{signingDetail.signingExpireTime}</List.Item>
            </List>
            <List renderHeader={() => '粘贴地点'}>
              <List.Item wrap>{signingDetail.address}</List.Item>
            </List>
            <List renderHeader={() => '工作时间'}>
              <List.Item wrap>
                {signingDetail.beginTime} - {signingDetail.endTime}
              </List.Item>
            </List>
            {!isNot && (
              <Fragment>
                <List renderHeader={() => '操作人'}>
                  <List.Item>{signingDetail.pastePerson}</List.Item>
                </List>
                <List renderHeader={() => '备注'}>
                  <List.Item wrap>{signingDetail.pasteRemark}</List.Item>
                </List>
                <div className={styles.pasteImages}>
                  {Array.isArray(signingDetail.pasteImages) &&
                    signingDetail.pasteImages.map(url => (
                      <div className={styles.imgItem}>
                        <img src={url} alt="粘贴照片" />
                      </div>
                    ))}
                </div>
              </Fragment>
            )}
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default SigningDetail;
