import React, { PureComponent, Fragment, memo } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Carousel, Card, Toast } from 'antd-mobile';
import { TOP_STATE_YES } from '@/common/constants';

import styles from './styles.less';

const BigItem = memo(({ data }) => (
  <div className={`${styles.item} ${styles.big}`}>
    <Card onClick={() => router.push(`/h5/goods/${data.id}`)}>
      <div className={styles.header}>
        <img src={data.shopImage} alt={data.name} />
        <div className={styles.footer}>
          <p>
            {data.name}/{data.integral}积分
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
        <div className={styles.integral}>{data.integral}积分</div>
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
      type: 'goodsModel/queryGoods',
    }).then(({ success, list }) => {
      if (success) {
        const topList = [];
        const waterfallList = [];
        list.forEach(item => {
          // 处理商品名称，商户-商品名称，去掉商户名称
          const nameArr = item.name ? item.name.split('-') : [];
          if (nameArr.length === 2) {
            // eslint-disable-next-line prefer-destructuring
            item.name = nameArr[1];
          }

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
      <DocumentTitle title="积分商城">
        <Fragment>
          <div className={styles.wrap}>
            {topList.length > 0 && (
              <Carousel autoplay={false} infinite className={styles.carousel}>
                {topList.map(item => (
                  <Link className={styles.item} to={`/h5/goods/${item.id}`} key={item}>
                    <img src={item.banner} alt={item.title} />
                  </Link>
                ))}
              </Carousel>
            )}

            <section className={styles.content}>
              {pageData.map((item, index) =>
                index % 3 === 0 ? <BigItem data={item} /> : <SmallItem data={item} />
              )}
            </section>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default List;
