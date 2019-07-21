import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import moment from 'moment';
import { Carousel } from 'antd-mobile';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import PullToRefreshWrap from '@/components/PullToRefresh';
import { TOP_STATE_YES, PUBLISH_STATE_YES } from '@/common/constants';

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

  async componentDidMount() {
    await this.getList();
  }

  getList = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'activityModel/queryActivities',
      payload: {
        isPublish: PUBLISH_STATE_YES,
      },
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
      return <Loading />;
    }

    if ([...pageData, ...topList].length === 0) {
      return (
        <DocumentTitle title="活动中心">
          <Empty showback={false} text="还没有相关活动哟~" />
        </DocumentTitle>
      );
    }

    return (
      <DocumentTitle title="活动中心">
        <Fragment>
          <div className={styles.wrap}>
            <PullToRefreshWrap onRefresh={() => this.getList()}>
              {topList.length > 0 && (
                <Carousel autoplay={false} infinite className={styles.carousel}>
                  {topList.map(item => (
                    <Link className={styles.item} to={`/h5/activities/${item.id}`} key={item.id}>
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
            </PullToRefreshWrap>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default List;
