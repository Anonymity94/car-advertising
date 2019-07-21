import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { List, Modal, WhiteSpace } from 'antd-mobile';
import { connect } from 'dva';
import QRCode from 'qrcode';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import {
  AD_PASTE_STATE_PASTED,
  AD_PASTE_STATE_REFUSE,
  AD_PASTE_STATE_UN_REVIEW,
  AD_PASTE_STATE_UN_PASTED,
} from '@/common/constants';
import { Tag } from 'antd';

import styles from './ADSigning.less';
import PullToRefreshWrap from '@/components/PullToRefresh';

@connect(
  ({ adSigningModel: { detail: signingDetail }, adModel: { detail: adDetail }, loading }) => ({
    signingDetail,
    adDetail,
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
    const { signingDetail } = this.props;

    if (!signingDetail.id) {
      Modal.alert('无法生成签约二维码', '没有找到相关签约记录', [
        {
          text: '关闭',
          onPress: () => {},
        },
      ]);
      return;
    }

    // 生成二维码信息
    QRCode.toDataURL(`${window.location.origin}/wechat/ad-signing-qrcode?id=${signingDetail.id}`)
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

    const isUnReview = signingDetail.pasteState === AD_PASTE_STATE_UN_REVIEW;

    return (
      <DocumentTitle title="签约详情">
        <Fragment>
          <div className={styles.signingDetail}>
            <PullToRefreshWrap onRefresh={() => this.queryAdSigningDetail()}>
              <List>
                <List.Item
                  extra={
                    <Fragment>
                      {signingDetail.pasteState === AD_PASTE_STATE_UN_REVIEW && (
                        <span>
                          <Tag color="#ff9800">待确认</Tag> 粘贴二维码
                        </span>
                      )}
                      {signingDetail.pasteState === AD_PASTE_STATE_UN_PASTED && (
                        <Tag color="#2db7f5">未粘贴</Tag>
                      )}
                      {signingDetail.pasteState === AD_PASTE_STATE_PASTED && (
                        <Tag color="#87d068">已粘贴</Tag>
                      )}
                      {signingDetail.pasteState === AD_PASTE_STATE_REFUSE && (
                        <Tag color="#f50">拒绝粘贴</Tag>
                      )}
                    </Fragment>
                  }
                  arrow={isUnReview ? 'horizontal' : ''}
                  onClick={isUnReview ? () => this.showQrcode() : () => null}
                >
                  状态
                </List.Item>
                <List.Item extra={signingDetail.username}>用户</List.Item>
                <List.Item extra={signingDetail.createTime}>提交时间</List.Item>
                <List.Item
                  extra={
                    <Fragment>
                      {signingDetail.address}
                      <br />
                      {signingDetail.beginTime} - {signingDetail.endTime}
                    </Fragment>
                  }
                >
                  粘贴地点
                </List.Item>
              </List>
              <WhiteSpace size="sm" />
              <List>
                <List.Item extra={adDetail.title}>广告</List.Item>
                <List.Item extra={adDetail.company}>机构名称</List.Item>
                <List.Item extra={`${signingDetail.bonus}元/月`}>签约金额</List.Item>
                <List.Item extra={signingDetail.signingExpireTime}>签约有效期</List.Item>
                {!isNot && (
                  <Fragment>
                    <List.Item extra={signingDetail.pastePerson}>操作人</List.Item>
                    <List.Item extra={signingDetail.pasteRemark}>备注</List.Item>
                  </Fragment>
                )}
              </List>

              {!isNot && (
                <Fragment>
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
            </PullToRefreshWrap>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default SigningDetail;
