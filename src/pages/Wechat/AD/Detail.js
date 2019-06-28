import React, { PureComponent, Fragment, memo } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import moment from 'moment';
import { PullToRefresh, Card, Toast } from 'antd-mobile';

import signingIcon from '../icons/icon_signing@2x.png';
import styles from './styles.less';
import router from 'umi/router';

@connect(({ adModel: { detail }, loading }) => ({
  detail,
  queryLoading: loading.effects['adModel/queryAdContent'],
}))
class List extends PureComponent {
  state = {
    refreshing: false,
    height: document.documentElement.clientHeight,
  };

  componentDidMount() {
    this.getAdContent();
    // const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
    setTimeout(
      () =>
        this.setState({
          // height: hei - 30,
        }),
      0
    );
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
    const { queryLoading } = this.props;

    const detail = {
      id: 0.5673063366855791,
      title: '广告名称广告名称广告名称广',
      company: '所属公司机构',
      banner:
        'https://img.zcool.cn/community/01c22b5b596b74a801206a35e43a5e.png@1280w_1l_2o_100sh.png',
      cover: [
        'https://img.zcool.cn/community/01c22b5b596b74a801206a35e43a5e.png@1280w_1l_2o_100sh.png',
        'https://img.zcool.cn/community/01c22b5b596b74a801206a35e43a5e.png@1280w_1l_2o_100sh.png',
      ],
      clause: '/12/234/2323.pdf',
      bonus: 1000,
      integral: 20,
      content: '<p style="color: red">广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容</p>',
      remark: '积分备注',
      address: [
        {
          address: '北京市海淀区',
          beginTime: '2019-06-19',
          endTime: '2019-07-19',
        },
        {
          address: '北京市海淀区',
          beginTime: '2019-06-19',
          endTime: '2019-07-19',
        },
      ],
      publishTime: '2019-06-19 17:59:44',
      createTime: '2019-06-19 17:59:44',
      modifyTime: '2019-06-19 17:59:44',
      isTop: 1,
      isPublish: 0,
      operator: '测试',
      visitCount: 20,
      signingCount: 340,
    };

    if (queryLoading) {
      Toast.loading('加载中....', 0);
    } else {
      Toast.hide();
    }

    return (
      <DocumentTitle title={detail.title}>
        <Fragment>
          <div className={styles.wrap}>
            <div className={styles.article}>
              {/* 标题 */}
              <div className={styles.header}>
                <h2>{detail.title}</h2>
                <div className={styles.caption}>
                  <p className={styles.author}>
                    {detail.operator}/{moment(detail.createTime).fromNow()}
                  </p>
                  <p className={styles.visit}>阅读{detail.visitCount}</p>
                </div>
              </div>
              {/* 内容 */}
              <div className={styles.content}>
                {/* 内容列表图片 */}
                {detail.cover.map(img => (
                  <img src={img} alt="" />
                ))}
                <div dangerouslySetInnerHTML={{ __html: `${detail.content}` }} />
              </div>

              <div className={styles.operate}>
                <div className={styles.operateItem}>
                  签约可获<span className={styles.integral}>{detail.integral}</span>积分
                </div>
                <div className={styles.operateItem}>
                  <span className={styles.btn} onClick={() => router.push(`/h5/ads/${detail.id}/signing`)}>立即签约</span>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default List;
