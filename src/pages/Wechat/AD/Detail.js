import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import moment from 'moment';
import Loading from '@/components/Loading';
import { Toast } from 'antd-mobile';
import { countFormatter } from '@/utils/utils';

import router from 'umi/router';
import styles from './styles.less';

@connect(({ adModel: { detail }, loading }) => ({
  detail,
  queryLoading: loading.effects['adModel/queryAdContent'],
}))
class Detail extends PureComponent {
  state = {
    refreshing: false,
  };

  componentDidMount() {
    this.getAdContent();
  }

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

  // 下拉刷新
  pullDownRefresh = () => {
    console.log('下拉刷新');
  };

  render() {
    const { queryLoading, detail } = this.props;

    if (queryLoading) {
      Toast.loading('加载中....', 0);
      return <Loading />;
    }
    Toast.hide();

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
                    {detail.operator}/{moment(detail.createTime).format('YYYY-MM-DD')}
                  </p>
                  <p className={styles.visit}>阅读{countFormatter(detail.visitCount)}</p>
                </div>
              </div>
              {/* 内容 */}
              <div className={styles.content}>
                {/* 内容列表图片 */}
                {Array.isArray(detail.cover) &&
                  detail.cover.map(img => <img src={img} alt="图片" />)}
                <div dangerouslySetInnerHTML={{ __html: `${detail.content}` }} />
              </div>

              <div className={styles.operate}>
                <div className={styles.operateItem}>
                  签约可获<span className={styles.integral}>{detail.integral}</span>积分
                </div>
                <div className={styles.operateItem}>
                  <span
                    className={styles.btn}
                    onClick={() => router.push(`/h5/ads/${detail.id}/signing`)}
                  >
                    立即签约
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default Detail;
