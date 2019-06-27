import React, { PureComponent, Fragment, memo } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import { Carousel, Card, Toast } from 'antd-mobile';
import Scroll from '@/components/Scroll';
import Loading from '@/components/Loading';
import { TOP_STATE_YES } from '@/common/constants';

import styles from './styles.less';

// 每页多少条
const PAGE_SIZE = 10;

const ColumnList = memo(({ list }) =>
  list.map(item => (
    <div className={styles.item}>
      <Card>
        <Card.Header>2323</Card.Header>
        <Card.Body>
          <div>This is content of `Card`</div>
        </Card.Body>
        <Card.Footer content="footer content" extra={<div>extra footer content</div>} />
      </Card>
    </div>
  ))
);

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

      loading: false,
      options: {
        pullUpLoad: true,
        // pullDownRefresh: true,
        probeType: 3,
      },
      page: 0,
    };
  }

  componentDidMount() {
    this.setState({
      loading: true,
    });
    this.getAds();
  }

  getAds = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'adModel/queryAds',
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
          },
          () => {
            this.getMoreData(this.state.page);
          }
        );
      }
    });
  };

  getMoreData = page => {
    const { waterfallList, pageData } = this.state;

    const begin = page * PAGE_SIZE;
    const moreData = waterfallList.slice(begin, PAGE_SIZE);

    this.setState({
      pageData: pageData.concat(moreData),
      loading: false,
      page,
    });
  };

  // 上拉加载
  pullUpLoad = () => {
    console.log('上拉加载');
    this.setState({
      loading: true,
    });
  };

  // 下拉刷新
  pullDownRefresh = () => {
    console.log('下拉刷新');
  };

  render() {
    const { queryLoading } = this.props;
    const { options, pageData, loading, topList } = this.state;

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
              <Carousel autoplay={false} infinite>
                {topList.map(item => (
                  <Link
                    to={`/h5/ads/${item.id}`}
                    key={item}
                    style={{ display: 'inline-block', width: '100%', height: 150 }}
                  >
                    <img
                      src={item.banner}
                      alt={item.title}
                      style={{ width: '100%', verticalAlign: 'top' }}
                    />
                  </Link>
                ))}
              </Carousel>
            )}

            {/* 瀑布流 */}
            <div className={styles.content}>
              <Scroll
                options={options}
                pullUpLoad={this.pullUpLoad}
                pullDownRefresh={this.pullDownRefresh}
              >
                <ColumnList list={pageData} />
                <Loading show={loading} />
              </Scroll>
            </div>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default List;
