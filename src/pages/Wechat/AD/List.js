import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import router from 'umi/router';
import { Carousel, PullToRefresh, ListView } from 'antd-mobile';
import isEqual from 'lodash/isEqual';

import Link from 'umi/link';
import styles from './styles.less';

const NUM_ROWS = 10;
const pageIndex = 0;

@connect(({ adModel: { topList, waterfallList } }) => ({
  topList,
  waterfallList,
}))
class List extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      waterfallList: [],
      pageData: [],

      refreshing: true,
      isLoading: true,
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;

    await dispatch({
      type: 'adModel/queryAds',
    });

    const { waterfallList } = this.props;
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (!isEqual(nextProps.waterfallList, state.waterfallList)) {
      return {
        waterfallList: nextProps.waterfallList,
      };
    }
    return null;
  }

  onRefresh = () => {
    this.setState({ refreshing: true, isLoading: true });
    // simulate initial Ajax
    setTimeout(() => {
      this.setState({
        dataSource: [],
        refreshing: false,
        isLoading: false,
      });
    }, 600);
  };

  genData = (pIndex = 0) => {
    const { waterfallList } = this.props;
    // 从waterfallList摘取相应的数据
  };

  onEndReached = event => {
    const { isLoading, hasMore, pageData } = this.state;
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (isLoading && !hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.rData = { ...this.rData, ...this.genData(pageIndex + 1) };
      this.setState({
        pageData: pageData.cloneWithRows(this.rData),
        isLoading: false,
      });
    }, 1000);
  };

  render() {
    const { topList } = this.props;
    const { pageData, refreshing, isLoading } = this.state;

    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    let index = pageData.length - 1;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = pageData.length - 1;
      }
      const obj = pageData[index - 1];
      return (
        <div key={rowID} style={{ padding: '0 15px' }}>
          {obj.title}
        </div>
      );
    };

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
              <ListView
                dataSource={pageData}
                renderHeader={() => <span>Pull to refresh</span>}
                renderFooter={() => (
                  <div style={{ padding: 30, textAlign: 'center' }}>
                    {isLoading ? 'Loading...' : 'Loaded'}
                  </div>
                )}
                renderRow={row}
                renderSeparator={separator}
                useBodyScroll
                pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />}
                onEndReached={this.onEndReached}
                pageSize={5}
              />
            </div>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default List;
