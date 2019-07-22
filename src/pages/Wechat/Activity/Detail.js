import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import moment from 'moment';
import { Toast, Modal, Icon } from 'antd-mobile';
import {
  AUDIT_STATE_REFUSE,
  AUDIT_STATE_UNREVIEWED,
  PUBLISH_STATE_YES,
  AUDIT_STATE_NO_REGISTER,
} from '@/common/constants';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';

import router from 'umi/router';
import styles from './styles.less';

@connect(({ activityModel: { detail }, driverModel: { detail: userInfo }, loading }) => ({
  detail,
  userInfo,
  queryLoading: loading.effects['activityModel/queryActivityContent'],
}))
class Detail extends PureComponent {
  alertModal = null;

  state = {
    isJoin: 'NAN', // 未检查状态, true 已参与，false 未参与
  };

  componentDidMount() {
    this.getContent();
    this.checkUserJoinState();
  }

  checkUserJoinState = () => {
    const {
      dispatch,
      match: { params },
      userInfo,
    } = this.props;

    if (!userInfo.id) return;

    dispatch({
      type: 'activityModel/checkUserJoinState',
      payload: {
        id: params.id,
      },
    }).then(({ success, result }) => {
      if (success) {
        this.setState({
          isJoin: result,
        });
      } else {
        Toast.fail('检查用户参与情况失败', 2);
      }
    });
  };

  getContent = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;

    dispatch({
      type: 'activityModel/queryActivityContent',
      payload: {
        id: params.id,
      },
    });
  };

  joinActivity = () => {
    const { dispatch, detail, userInfo } = this.props;

    if (!detail.id || !userInfo.id) return;

    Modal.alert('确定参与活动吗？', '', [
      { text: '取消', onPress: () => {}, style: 'default' },
      {
        text: '确定',
        onPress: () => {
          dispatch({
            type: 'activityModel/joinActivity',
            payload: {
              id: detail.id, // 活动id
            },
          }).then(success => {
            if (success) {
              this.setState({ isJoin: true });
              Modal.alert('参与成功', '请准时参与活动', [
                {
                  text: '好的',
                  onPress: () => {
                    router.goBack();
                  },
                },
              ]);
            } else {
              Modal.alert('参与失败', '', [{ text: '好的', onPress: () => {} }]);
            }
          });
        },
      },
    ]);
  };

  render() {
    const { isJoin } = this.state;
    const { queryLoading, detail, userInfo } = this.props;

    if (queryLoading) {
      return <Loading />;
    }

    if (!detail.id) {
      return (
        <Fragment>
          <Empty text="活动不存在或已被删除" />
        </Fragment>
      );
    }

    if (detail.isPublish !== PUBLISH_STATE_YES) {
      return (
        <Fragment>
          <Empty text="活动已下线" />
        </Fragment>
      );
    }

    const renderOperateBtn = () => {
      const { id, status } = userInfo;
      if (!id) {
        return (
          <span
            className={styles.btnCancel}
            onClick={() => {
              Modal.alert('无法参与', '尚未登录', [
                { text: '知道了', onPress: () => {} },
                { text: '立即登录', onPress: () => router.push('/h5/user/bind'), style: 'default' },
              ]);
            }}
          >
            未登录
          </span>
        );
      }
      if (status === AUDIT_STATE_NO_REGISTER) {
        return (
          <span
            className={styles.btnCancel}
            onClick={() => {
              Modal.alert('无法参与', '尚未注册会员', [
                { text: '知道了', onPress: () => {}, style: 'default' },
                {
                  text: '立即注册',
                  onPress: () => router.push('/h5/user/register'),
                  style: 'default',
                },
              ]);
            }}
          >
            未注册会员
          </span>
        );
      }
      if (!status || status === AUDIT_STATE_UNREVIEWED) {
        return (
          <span
            className={styles.btnCancel}
            onClick={() => {
              Modal.alert('无法参与', '注册信息审核中', [
                { text: '知道了', onPress: () => {}, style: 'default' },
              ]);
            }}
          >
            注册信息等待审核
          </span>
        );
      }
      if (status === AUDIT_STATE_REFUSE) {
        return (
          <span
            className={styles.btnCancel}
            onClick={() => {
              Modal.alert('无法参与', '注册申请未通过', [
                { text: '知道了', onPress: () => {}, style: 'default' },
              ]);
            }}
          >
            注册未通过
          </span>
        );
      }

      return (
        <Fragment>
          {isJoin === 'NAN' && (
            <span className={styles.btnCancel}>
              <Icon type="loading" />
            </span>
          )}
          {isJoin !== 'NAN' && isJoin && <span className={styles.btnCancel}>已参与</span>}
          {isJoin !== 'NAN' && !isJoin && (
            <span className={styles.btnOk} onClick={() => this.joinActivity()}>
              我要参与
            </span>
          )}
        </Fragment>
      );
    };

    return (
      <DocumentTitle title={detail.title}>
        <Fragment>
          <div className={`${styles.wrap} ${styles.detail}`}>
            <div className={styles.article}>
              {/* 标题 */}
              <div className={styles.header}>
                <h2 className={styles.title}>{detail.title}</h2>
                <div className={styles.caption}>
                  <p className={styles.author}>
                    {detail.company}/{moment(detail.createTime).format('YYYY-MM-DD')}
                  </p>
                  <p className={styles.visit}>阅读{detail.visitCount}</p>
                </div>
              </div>
              {/* 内容 */}
              <div className={styles.content}>
                {/* 活动内容 */}
                <p className={styles.divider}>活动内容</p>
                <div dangerouslySetInnerHTML={{ __html: `${detail.content}` }} />

                <p className={styles.divider}>参与方式</p>
                <div dangerouslySetInnerHTML={{ __html: `${detail.participation}` }} />
              </div>

              <div className={styles.operate}>
                <div className={styles.operateItem}>{renderOperateBtn()}</div>
              </div>
            </div>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default Detail;
