import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { List, WhiteSpace, Flex, Button, Modal, Toast } from 'antd-mobile';
import { connect } from 'dva';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import {
  AD_PASTE_STATE_PASTED,
  AD_PASTE_STATE_REFUSE,
  AD_PASTE_STATE_UN_REVIEW,
  AD_PASTE_STATE_UN_PASTED,
} from '@/common/constants';
import { Tag } from 'antd';

import styles from './style.less';

@connect(
  ({
    adSigningModel: { detail: signingDetail },
    adModel: { detail: adDetail },
    login: { currentUser },
    loading,
  }) => ({
    signingDetail,
    adDetail,
    currentUser,
    loading:
      loading.effects['adSigningModel/queryAdSigningDetail'] ||
      loading.effects['adModel/queryAdContent'],
  })
)
class SigningDetail extends PureComponent {
  componentDidMount() {
    this.queryLoggedUser();
  }

  queryLoggedUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/queryLoggedUser',
      payload: {
        from: 'wechat-qrcode',
      },
    }).then(() => {
      this.queryAdSigningDetail();
    });
  };

  queryAdSigningDetail = () => {
    const { dispatch, location } = this.props;
    const { id } = location.query;
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

  handleOk = () => {
    const { dispatch, location } = this.props;
    const { id } = location.query;
    Modal.alert(
      '确定开始粘贴广告吗？',
      <span>
        确定后，请在
        <br />
        审核管理/广告签约管理/粘贴广告
        <br />
        继续下一步操作
      </span>,
      [
        { text: '取消', onPress: () => {}, style: 'default' },
        {
          text: '确定',
          onPress: () => {
            Toast.loading('提交中...', 0);
            dispatch({
              type: 'adSigningModel/beginPaste',
              payload: {
                id,
              },
            }).then(success => {
              this.queryAdSigningDetail();
              Toast.hide();
            });
          },
        },
      ]
    );
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
      <DocumentTitle title="广告粘贴审核">
        <Fragment>
          <div className={styles.signingDetail}>
            <List>
              <List.Item
                extra={
                  <Fragment>
                    {signingDetail.pasteState === AD_PASTE_STATE_UN_REVIEW && (
                      <Tag color="#ff9800">待确定</Tag>
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
              >
                状态
              </List.Item>
              <List.Item extra={signingDetail.username}>用户</List.Item>
              <List.Item extra={signingDetail.createTime}>提交时间</List.Item>
            </List>
            <WhiteSpace size="sm" />
            <List>
              <List.Item extra={adDetail.title}>广告</List.Item>
              <List.Item extra={adDetail.company}>机构名称</List.Item>
              <List.Item extra={`${signingDetail.bonus}元/月`}>签约金额</List.Item>
              <List.Item extra={signingDetail.signingExpireTime}>签约有效期</List.Item>
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
            {(!signingDetail.pasteState ||
              signingDetail.pasteState === AD_PASTE_STATE_UN_REVIEW) && (
              <Fragment>
                <Flex style={{ width: '90%', margin: '20px auto 0' }}>
                  <Flex.Item>
                    <Button type="primary" onClick={() => this.handleOk()}>
                      开始粘贴
                    </Button>
                  </Flex.Item>
                </Flex>
              </Fragment>
            )}
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default SigningDetail;
