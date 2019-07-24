import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Toast, Modal } from 'antd-mobile';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import {
  PUBLISH_STATE_YES,
  AUDIT_STATE_REFUSE,
  AUDIT_STATE_UNREVIEWED,
  AUDIT_STATE_PASSED,
  AUDIT_STATE_NO_REGISTER,
} from '@/common/constants';

import router from 'umi/router';
import styles from '../article.less';

@connect(({ goodsModel: { detail }, driverModel: { detail: userInfo }, loading }) => ({
  detail,
  userInfo,
  queryLoading: loading.effects['goodsModel/queryGoodsContent'],
}))
class Detail extends PureComponent {
  state = {
    isExchanged: 'NAN', // 未检查状态, true 已兑换，false 未兑换
  };

  componentDidMount() {
    this.getContent();
    this.checkUserExchangeState();
  }

  checkUserExchangeState = () => {
    const {
      dispatch,
      match: { params },
      userInfo,
    } = this.props;

    if (!userInfo.id) return;

    dispatch({
      type: 'goodsModel/checkUserExchangeState',
      payload: {
        id: params.id,
      },
    }).then(({ success, result }) => {
      if (success) {
        this.setState({
          isExchanged: result,
        });
      } else {
        Toast.fail('检查兑换情况失败', 2);
      }
    });
  };

  getContent = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;

    dispatch({
      type: 'goodsModel/queryGoodsContent',
      payload: {
        id: params.id,
      },
    });
  };

  updateDriverIntegral = ({ id, restIntegral, usedIntegral }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/updateDriverIntegral',
      payload: {
        id,
        restIntegral,
        usedIntegral,
      },
    });
  };

  showReason = () => {
    const { userInfo } = this.props;
    if (!userInfo.id || userInfo.status === AUDIT_STATE_NO_REGISTER) {
      Modal.alert('无法兑换', '尚未注册会员', [
        { text: '知道了', onPress: () => {}, style: 'default' },
        { text: '立即注册', onPress: () => router.push('/h5/user/register'), style: 'default' },
      ]);
    }

    if (userInfo.id && userInfo.status === AUDIT_STATE_REFUSE) {
      Modal.alert('无法兑换', '注册申请未通过', [
        { text: '知道了', onPress: () => {}, style: 'default' },
        {
          text: '重新注册',
          onPress: () => router.push('/h5/user/register'),
          style: 'default',
        },
      ]);
    }
    if (userInfo.id && (userInfo.status === AUDIT_STATE_UNREVIEWED || !userInfo.status)) {
      Modal.alert('无法兑换', '注册信息审核中，审核通过后才可以兑换', [
        { text: '知道了', onPress: () => {}, style: 'default' },
      ]);
    }
  };

  exchangeGood = () => {
    const { dispatch, detail, userInfo } = this.props;
    if (!detail.id) return;

    const { restIntegral = 0, usedIntegral = 0, id: userId } = userInfo;

    // 检查自己的积分是否足够兑换
    if (detail.integral > restIntegral) {
      Modal.alert('兑换失败', `积分不足：当前可用积分${restIntegral}`, [
        { text: '好的', onPress: () => {} },
      ]);
      return;
    }

    Modal.alert('确定兑换商品吗？', '', [
      { text: '取消', onPress: () => {}, style: 'default' },
      {
        text: '确定',
        onPress: () => {
          Toast.loading('提交中...', 0);
          dispatch({
            type: 'goodsModel/exchangeGood',
            payload: {
              id: detail.id, // 活动id
            },
          }).then(success => {
            Toast.hide();
            if (success) {
              this.setState({ isExchanged: true });
              // 去更新用户的积分情况
              this.updateDriverIntegral({
                id: userId,
                restIntegral: restIntegral - detail.integral,
                usedIntegral: usedIntegral + detail.integral,
              });

              Modal.alert('兑换成功', '请到取货地址及时取货', [
                {
                  text: '好的',
                  onPress: () => {
                    router.goBack();
                    // 重新获取用户信息，刷新积分情况
                    dispatch({
                      type: 'login/queryWechatUser',
                    });
                  },
                },
              ]);
            } else {
              Modal.alert('兑换失败', '', [{ text: '好的', onPress: () => {} }]);
            }
          });
        },
      },
    ]);
  };

  render() {
    const { isExchanged } = this.state;
    const { queryLoading, detail, userInfo } = this.props;

    if (queryLoading) {
      return <Loading />;
    }

    if (!detail.id) {
      return (
        <Fragment>
          <Empty text="商品不存在或已被删除" />
        </Fragment>
      );
    }

    if (detail.isPublish !== PUBLISH_STATE_YES) {
      return (
        <Fragment>
          <Empty text="商品已下线" />
        </Fragment>
      );
    }

    return (
      <DocumentTitle title="积分商品详情">
        <Fragment>
          <div className={`${styles.article} ${styles.goods}`}>
            {/* 标题 */}
            <div className={styles.header}>
              <img src={detail.image} alt={detail.name} />
              <div className={styles.info}>
                <div className={styles.left}>
                  <h2 className={styles.title}>
                    {detail.name}
                    <span>{detail.integral}积分</span>
                  </h2>
                  <p className={styles.businessName}>{detail.businessName}</p>
                </div>
                <div className={styles.right}>
                  {userInfo.id && userInfo.status === AUDIT_STATE_PASSED ? (
                    <span
                      className={isExchanged ? '' : styles.active}
                      onClick={() => (isExchanged === false ? this.exchangeGood() : {})}
                    >
                      {isExchanged === false ? '兑换' : '已兑换'}
                    </span>
                  ) : (
                    <span onClick={() => this.showReason()}>无法兑换</span>
                  )}
                </div>
              </div>
            </div>
            {/* 内容 */}
            <div className={styles.content}>
              {/* 活动内容 */}
              <p className={styles.divider}>取货地址</p>
              <div dangerouslySetInnerHTML={{ __html: `${detail.address}` }} />

              <p className={styles.divider}>商品内容</p>
              <div dangerouslySetInnerHTML={{ __html: `${detail.content}` }} />
            </div>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default Detail;
