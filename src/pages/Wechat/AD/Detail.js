import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import moment from 'moment';
import Loading from '@/components/Loading';
import { countFormatter } from '@/utils/utils';

import router from 'umi/router';
import { Modal, Toast } from 'antd-mobile';
import Empty from '@/components/Empty';
import {
  PUBLISH_STATE_YES,
  AUDIT_STATE_REFUSE,
  AUDIT_STATE_UNREVIEWED,
  AUDIT_STATE_NO_REGISTER,
} from '@/common/constants';

import styles from '../article.less';

@connect(({ adModel: { detail }, driverModel: { detail: userInfo }, loading }) => ({
  userInfo,
  detail,
  queryLoading: loading.effects['adModel/queryAdContent'],
}))
class Detail extends PureComponent {
  state = {
    canSigning: true, // 是否可以签约
  };

  componentDidMount() {
    this.getAdContent();
    this.checkUserSigningState();
  }

  checkUserSigningState = () => {
    const {
      dispatch,
      match: { params },
      userInfo,
    } = this.props;

    if (!userInfo.id) return;

    dispatch({
      type: 'adModel/checkUserSigningState',
      payload: {
        id: params.id,
      },
    }).then(({ success, result }) => {
      if (success) {
        this.setState({
          canSigning: result,
        });
      } else {
        Toast.fail('检查签约情况失败', 2);
      }
    });
  };

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

  render() {
    const { canSigning } = this.state;
    const { queryLoading, detail, userInfo } = this.props;

    if (queryLoading) {
      return <Loading />;
    }

    if (!detail.id) {
      return (
        <Fragment>
          <Empty text="广告不存在或已被删除" />
        </Fragment>
      );
    }

    if (detail.isPublish !== PUBLISH_STATE_YES) {
      return (
        <Fragment>
          <Empty text="广告已下线" />
        </Fragment>
      );
    }

    const renderOperateBtn = () => {
      const { id, status } = userInfo;
      if (!id || status === AUDIT_STATE_NO_REGISTER) {
        return (
          <span
            className={styles.btn}
            onClick={() => {
              Modal.alert('无法签约', '尚未注册会员', [
                { text: '知道了', onPress: () => {}, style: 'default' },
                {
                  text: '立即注册',
                  onPress: () => router.push('/h5/user/register'),
                  style: 'default',
                },
              ]);
            }}
          >
            尚未注册
          </span>
        );
      }
      if (!status || status === AUDIT_STATE_UNREVIEWED) {
        return (
          <span
            className={styles.btn}
            onClick={() => {
              Modal.alert('无法签约', '注册信息审核中，审核通过后才可以签约', [
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
            className={styles.btn}
            onClick={() => {
              Modal.alert('无法签约', '注册申请未通过', [
                { text: '知道了', onPress: () => {}, style: 'default' },
                {
                  text: '重新注册',
                  onPress: () => router.push('/h5/user/register'),
                  style: 'default',
                },
              ]);
            }}
          >
            注册未通过
          </span>
        );
      }

      if (!canSigning) {
        return (
          <span
            className={styles.btn}
            onClick={() => {
              Modal.alert('无法签约', '您已经签约过这个广告', [
                { text: '知道了', onPress: () => {}, style: 'default' },
              ]);
            }}
          >
            已签约
          </span>
        );
      }

      return (
        <span className={styles.btn} onClick={() => router.push(`/h5/ads/${detail.id}/signing`)}>
          立即签约
        </span>
      );
    };

    return (
      <DocumentTitle title={detail.title}>
        <Fragment>
          <div className={`${styles.article} ${styles.ad}`}>
            {/* 标题 */}
            <div className={styles.header}>
              <h2 className={styles.title}>{detail.title}</h2>
              <div className={styles.caption}>
                <p className={styles.author}>
                  {detail.operator}/{moment(detail.createTime).format('YYYY-MM-DD')}
                </p>
                <p className={styles.visit}>
                  阅读{countFormatter((detail.visitCount || 0) * 3200)}
                </p>
              </div>
            </div>
            {/* 内容 */}
            <div className={styles.content}>
              {/* 内容列表图片 */}
              {Array.isArray(detail.cover) && detail.cover.map(img => <img src={img} alt="图片" />)}
              {/* 广告内容 */}
              <p className={styles.divider}>广告内容</p>
              <div dangerouslySetInnerHTML={{ __html: `${detail.content}` }} />

              <p className={styles.divider}>积分说明</p>
              <div dangerouslySetInnerHTML={{ __html: `${detail.remark}` }} />
            </div>
            <div className={styles.operate}>
              <div className={styles.operateItem}>
                签约可获<span className={styles.integral}>{detail.integral}</span>积分
              </div>
              <div className={styles.operateItem}>{renderOperateBtn()}</div>
            </div>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default Detail;
