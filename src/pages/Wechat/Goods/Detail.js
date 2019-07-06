import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Toast, Modal } from 'antd-mobile';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import { PUBLISH_STATE_YES } from '@/common/constants';

import router from 'umi/router';
import styles from './styles.less';

@connect(({ goodsModel: { detail }, login: { wechatUser }, loading }) => ({
  detail,
  wechatUser,
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
    } = this.props;

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

  exchangeGood = () => {
    const { dispatch, detail, wechatUser } = this.props;
    if (!detail.id) return;

    // 检查自己的积分是否足够兑换
    if (!(wechatUser.userIntegral && wechatUser.userIntegral >= detail.integral)) {
      Modal.alert('兑换失败', '积分不足', [{ text: '好的', onPress: () => {} }]);
      return;
    }

    Modal.alert('确定兑换商品吗？', '', [
      { text: '取消', onPress: () => {}, style: 'default' },
      {
        text: '确定',
        onPress: () => {
          dispatch({
            type: 'goodsModel/exchangeGood',
            payload: {
              id: detail.id, // 活动id
            },
          }).then(success => {
            if (success) {
              this.setState({ isExchanged: true });
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
    const { queryLoading, detail } = this.props;

    if (queryLoading) {
      Toast.loading('加载中....', 0);
      return <Loading />;
    }
    Toast.hide();

    if (!detail.id) {
      return (
        <Fragment>
          <Empty text="广告不存在或已被删除" />
        </Fragment>
      );
    }

    if (detail.isPublish === PUBLISH_STATE_YES) {
      return (
        <Fragment>
          <Empty text="广告已下线" />
        </Fragment>
      );
    }

    return (
      <DocumentTitle title="积分商品详情">
        <Fragment>
          <div className={styles.wrap}>
            <div className={styles.article}>
              {/* 标题 */}
              <div className={styles.header}>
                <img src={detail.image} alt={detail.name} />
                <div className={styles.info}>
                  <div className={styles.left}>
                    <h2 className={styles.title}>
                      {detail.name && detail.name.replace(`${detail.businessName}-`, '')}
                      <span>{detail.integral}积分</span>
                    </h2>
                    <p className={styles.businessName}>{detail.businessName}</p>
                  </div>
                  <div className={styles.right}>
                    <span
                      className={styles.btn}
                      onClick={() => (isExchanged === false ? this.exchangeGood() : {})}
                    >
                      {isExchanged === false ? '兑换' : '已兑换'}
                    </span>
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
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default Detail;
