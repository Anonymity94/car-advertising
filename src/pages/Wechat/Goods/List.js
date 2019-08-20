import React, { PureComponent, Fragment, memo } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Carousel, Card } from 'antd-mobile';
import Empty from '@/components/Empty';
import { TOP_STATE_YES, PUBLISH_STATE_YES } from '@/common/constants';

import styles from './styles.less';
import Loading from '@/components/Loading';
import PullToRefreshWrap from '@/components/PullToRefresh';

const BigItem = memo(({ data }) => (
  <div className={`${styles.item} ${styles.big}`}>
    <Card onClick={() => router.push(`/h5/goods/${data.id}`)}>
      <div className={styles.header}>
        <img src={data.shopImage} alt={data.name} />
        <div className={styles.footer}>
          <p>
            {data.name}/{data.integral}乐蚁果
          </p>
          <span>{data.businessName}</span>
        </div>
      </div>
    </Card>
  </div>
));

const SmallItem = memo(({ data }) => (
  <div className={`${styles.item} ${styles.small}`}>
    <Card onClick={() => router.push(`/h5/goods/${data.id}`)}>
      <div className={styles.header}>
        <img src={data.image} alt={data.name} />
      </div>
      <Card.Body>
        <div className={styles.title}>{data.name}</div>
        <div className={styles.businessName}>{data.businessName}</div>
        <div className={styles.integral}>{data.integral}乐蚁果</div>
      </Card.Body>
    </Card>
  </div>
));

@connect(({ loading }) => ({
  queryLoading: loading.effects['goodsModel/queryGoods'],
}))
class List extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      topList: [], // 置顶的
      pageData: [], // 页面显示的列表
      refresh: false,
    };
  }

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'goodsModel/queryGoods',
      payload: {
        isPublish: PUBLISH_STATE_YES,
      },
    }).then(({ success, list }) => {
      this.setState({
        refresh: false,
      });
      if (success) {
        const topList = [];
        const waterfallList = [];
        list.forEach(item => {
          const newItem = { ...item };
          // 处理商品名称，商户-商品名称，去掉商户名称
          const nameArr = newItem.name ? newItem.name.split('-') : [];
          if (nameArr.length === 2) {
            // eslint-disable-next-line prefer-destructuring
            newItem.name = nameArr[1];
          }

          if (newItem.isTop === TOP_STATE_YES) {
            topList.push(newItem);
          } else {
            waterfallList.push(newItem);
          }
        });

        this.setState(
          {
            topList,
            pageData: waterfallList,
          },
          () => {
            // this.getMoreData(this.state.page);
          }
        );
      }
    });
  };

  handleRefresh = () => {
    this.setState(
      {
        refresh: true,
      },
      () => {
        this.getList();
      }
    );
  };

  render() {
    const { queryLoading } = this.props;
    const { pageData, topList, refresh } = this.state;

    if (queryLoading && !refresh) {
      return <Loading />;
    }

    if ([...pageData, ...topList].length === 0) {
      return (
        <DocumentTitle title="乐蚁果商城">
          <Empty showback={false} text="还没有相关商品哟~" />
        </DocumentTitle>
      );
    }

    return (
      <DocumentTitle title="乐蚁果商城">
        <Fragment>
          <div className={styles.wrap}>
            <PullToRefreshWrap onRefresh={() => this.handleRefresh()}>
              {topList.length > 0 && (
                <Carousel autoplay={false} infinite className={styles.carousel}>
                  {topList.map(item => (
                    <Link className={styles.item} to={`/h5/goods/${item.id}`} key={item.id}>
                      <img src={item.banner} alt={item.name} />
                    </Link>
                  ))}
                </Carousel>
              )}

              <section className={styles.content}>
                {pageData.map((item, index) =>
                  index % 3 === 0 ? <BigItem data={item} /> : <SmallItem data={item} />
                )}
              </section>
            </PullToRefreshWrap>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default List;
