import React, { PureComponent, Fragment, memo } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Carousel, Card, Toast } from 'antd-mobile';
import { TOP_STATE_YES } from '@/common/constants';

import signingIcon from '../icons/icon_signing@2x.png';
import styles from './styles.less';

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
          </Card.Body>
          <Card.Footer
            content={<div className={styles.money}>￥{item.bonus}</div>}
            extra={
              <div className={styles.extra}>
                <img className={styles.icon} src={signingIcon} alt="签约人数" />
                34
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
                  <Link className={styles.item} to={`/h5/ads/${item.id}`} key={item}>
                    <img src={item.banner} alt={item.title} />
                  </Link>
                ))}
              </Carousel>
            )}

            <section className={styles.content}>
              <ColumnList list={pageData} />
            </section>

            {/* <Scroll
              options={options}
              pullUpLoad={this.pullUpLoad}
              pullDownRefresh={this.pullDownRefresh}
            /> */}
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default List;
