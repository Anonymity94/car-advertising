import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Checkbox, Toast } from 'antd-mobile';

import styles from './styles.less';

const { AgreeItem } = Checkbox;

@connect(({ adModel: { detail }, loading }) => ({
  detail,
  queryLoading: loading.effects['adModel/queryAdContent'],
}))
class List extends PureComponent {
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
      content:
        '<p style="color: red">广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容广告内容</p>',
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
          <div className={styles.signingWrap}>
            <div className={styles.title}>
              <p>贴广告地址</p>
              <span>修改</span>
            </div>
            <div className={styles.address}>42343434343434</div>

            <div className={styles.time}>
              <span className={styles.label}>工作时间</span>
              <span className={styles.value}>23:34- 3434</span>
            </div>
            <div className={styles.clause}>
              <AgreeItem data-seed="logId" onChange={e => console.log('checkbox', e)}>
                我已确认，并同意{' '}
                <a
                  onClick={e => {
                    e.preventDefault();
                    alert('agree it');
                  }}
                >
                  签约条款
                </a>
              </AgreeItem>
            </div>
            <div className={styles.operate}>
              <div className={styles.operateItem}>
                签约可获<span className={styles.integral}>{detail.integral}</span>积分
              </div>
              <div className={styles.operateItem}>
                <span className={styles.btn}>立即签约</span>
              </div>
            </div>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default List;
