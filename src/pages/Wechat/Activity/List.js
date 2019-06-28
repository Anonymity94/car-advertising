import React, { PureComponent, Fragment, memo } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import moment from 'moment';
import { Carousel, Card, Toast } from 'antd-mobile';
import { TOP_STATE_YES } from '@/common/constants';

import signingIcon from '../icons/icon_signing@2x.png';
import styles from './styles.less';

@connect(({ loading }) => ({
  queryLoading: loading.effects['activityModel/queryActivities'],
}))
class List extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      topList: [], // 置顶的
      waterfallList: [], // 非置顶的

      pageData: [], // 页面显示的列表
    };
  }

  componentDidMount() {
    this.getAds();
  }

  getAds = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'activityModel/queryActivities',
    }).then(({ success, list }) => {
      if (success) {
        const topList = [];
        const waterfallList = [];
        list.forEach(item => {
          if (item.isTop === TOP_STATE_YES) {
            topList.push(item);
          } else {
            waterfallList.push(item);
          }
        });

        this.setState(
          {
            topList,
            waterfallList,
            pageData: waterfallList,
          },
          () => {
            // this.getMoreData(this.state.page);
          }
        );
      }
    });
  };

  render() {
    const { queryLoading } = this.props;
    const { pageData, topList } = this.state;

    if (queryLoading) {
      Toast.loading('加载中....', 0);
    } else {
      Toast.hide();
    }

    return (
      <DocumentTitle title="广告签约">
        <Fragment>
          <div className={styles.wrap}>
            {topList.length > 0 && (
              <Carousel autoplay={false} infinite className={styles.carousel}>
                {topList.map(item => (
                  <Link className={styles.item} to={`/h5/activities/${item.id}`} key={item}>
                    <img src={item.banner} alt={item.title} />
                  </Link>
                ))}
              </Carousel>
            )}

            <section className={styles.content}>
              {pageData.map(item => (
                <div
                  className={styles.item}
                  onClick={() => router.push(`/h5/activities/${item.id}`)}
                >
                  <div className={styles.left}>
                    <div className={styles.title}>{item.title}</div>
                    <div className={styles.extra}>
                      <p>{item.company}</p>
                      <p>{moment(item.publishTime).format('YYYY-MM-DD')}</p>
                    </div>
                  </div>
                  <div className={styles.right}>
                    <img src={item.banner} className={styles.cover} alt={item.title} />
                  </div>
                </div>
              ))}
            </section>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default List;
