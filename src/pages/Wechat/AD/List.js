import React, { PureComponent, memo } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Carousel, Card } from 'antd-mobile';
import { TOP_STATE_YES, PUBLISH_STATE_YES } from '@/common/constants';
import { countFormatter } from '@/utils/utils';
import Empty from '@/components/Empty';
// import Scroll from '@/components/Scroll';

import signingIcon from '../icons/icon_signing@2x.png';
import styles from './styles.less';
import Loading from '@/components/Loading';

const ColumnList = memo(({ list }) => (
  <div className={styles.column}>
    {list.map(item => (
      <div className={styles.item}>
        <Card onClick={() => router.push(`/h5/ads/${item.id}`)}>
          <div className={styles.header}>
            <img src={item.banner} alt="标题" />
          </div>
          <Card.Body>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.desc}>{item.company}</div>
          </Card.Body>
          <Card.Footer
            content={<div className={styles.money}>￥{item.bonus}</div>}
            extra={
              <div className={styles.extra}>
                <img className={styles.icon} src={signingIcon} alt="签约人数" />
                {countFormatter(item.signingCount)}
              </div>
            }
          />
        </Card>
      </div>
    ))}
  </div>
));

@connect(({ loading }) => ({
  queryLoading: loading.effects['adModel/queryAds'],
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
      type: 'adModel/queryAds',
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

  handleOnPullDownRefresh = () => {
    console.log(3434);
  };

  render() {
    const { queryLoading } = this.props;
    const { pageData, topList } = this.state;

    if (queryLoading) {
      return <Loading />;
    }

    if ([...pageData, ...topList].length === 0) {
      return (
        <DocumentTitle title="广告签约">
          <Empty showback={false} text="还没有相关广告哟~" />
        </DocumentTitle>
      );
    }

    return (
      <DocumentTitle title="广告签约">
        <div className={styles.wrap}>
          {topList.length > 0 && (
            <Carousel autoplay={false} infinite className={styles.carousel}>
              {topList.map(item => (
                <Link className={styles.item} to={`/h5/ads/${item.id}`} key={item}>
                  <img src={item.banner} alt={item.title} />
                </Link>
              ))}
            </Carousel>
          )}

          <section className={styles.content}>
            <ColumnList list={pageData} />
          </section>
        </div>
      </DocumentTitle>
    );
  }
}

export default List;
