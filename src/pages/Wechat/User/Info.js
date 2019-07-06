import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { List, Tabs, Toast } from 'antd-mobile';
import router from 'umi/router';
import { connect } from 'dva';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import { handleUpload, renderUploadHtml, IdcardForm, CarForm } from './Register';

import styles from './Info.less';
import defaultAvatar from './icons/default_avatar.png';

const tabs = [{ title: '身份证照片' }, { title: '车辆照片' }];

@connect(({ login: { wechatUser }, driverModel: { detail }, loading }) => ({
  wechatUser,
  detail,
  loading: loading.effects['driverModel/queryDriverDetail'],
}))
class UserInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.renderUploadHtml = renderUploadHtml.bind(this);
    this.handleUpload = handleUpload.bind(this);
  }

  async componentDidMount() {
    const { dispatch, wechatUser } = this.props;
    await dispatch({
      type: 'driverModel/queryDriverDetail',
      payload: {
        id: wechatUser.id,
      },
    });
  }

  handleChangeImage = values => {
    const { dispatch, wechatUser } = this.props;

    if (!wechatUser.id) {
      Toast.fail('修改失败', 1);
      return;
    }

    dispatch({
      type: 'driverModel/updateDriver',
      payload: {
        id: wechatUser.id,
        ...values,
      },
    }).then(success => {
      if (!success) {
        Toast.fail('修改失败', 1);
      } else {
        Toast.success('修改成功', 1);
      }
    });
  };

  render() {
    const { loading, detail, wechatUser } = this.props;
    if (loading) {
      return <Loading />;
    }

    if (!detail.id) {
      return (
        <Fragment>
          <Empty text="用户不存在" />
        </Fragment>
      );
    }

    return (
      <DocumentTitle title="个人资料">
        <Fragment>
          <div className={styles.userInfoWrap}>
            <div className={styles.header}>
              <img alt={detail.username} src={wechatUser.avatar || defaultAvatar} />
              <div className={styles.name}>
                <p>{detail.username}</p>
                <p>{detail.phone}</p>
              </div>
              <span className={styles.btn} onClick={() => router.push('/h5/user/change-phone')}>
                修改
              </span>
            </div>
            <div className={styles.info}>
              <List>
                <List.Item extra={detail.idcard}>身份证号</List.Item>
                <List.Item extra={detail.carCode}>行驶证号</List.Item>
                <List.Item extra={detail.carType}>车辆类型</List.Item>
              </List>
            </div>
          </div>
          <section className={styles.content}>
            <Tabs
              className={styles.tabs}
              tabBarBackgroundColor="transparent"
              tabs={tabs}
              initialPage={0}
              renderTab={tab => <span>{tab.title}</span>}
            >
              <div className={styles.item}>
                <IdcardForm
                  idcardBackImage={detail.idcardBackImage}
                  idcardFrontImage={detail.idcardFrontImage}
                  showbtn={false}
                  onUpload={this.handleChangeImage}
                />
              </div>
              <div className={styles.item}>
                <CarForm
                  carCodeImage={detail.carCodeImage}
                  driverLicenseImage={detail.driverLicenseImage}
                  carImage={detail.carImage}
                  showinfo={false}
                  showbtn={false}
                  onUpload={this.handleChangeImage}
                />
              </div>
            </Tabs>
          </section>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default UserInfo;
