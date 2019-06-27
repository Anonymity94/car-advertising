import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { List, Tabs } from 'antd-mobile';
import router from 'umi/router';
import { handleUpload, renderUploadHtml, IdcardForm, CarForm } from './Register';

import styles from './Info.less';

const tabs = [{ title: '身份证照片' }, { title: '车辆照片' }];

export default class UserInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.renderUploadHtml = renderUploadHtml.bind(this);
    this.handleUpload = handleUpload.bind(this);
  }

  handleChangeImage = values => {
    console.log(values);
  };

  render() {
    return (
      <DocumentTitle title="个人资料">
        <Fragment>
          <div className={styles.userInfoWrap}>
            <div className={styles.header}>
              <img alt="姓名" src="https://avatars2.githubusercontent.com/u/13148447?s=56&v=4" />
              <div className={styles.name}>
                <p>姓名</p>
                <p>23343523234</p>
              </div>
              <span className={styles.btn} onClick={() => router.push('/h5/user/change-phone')}>
                修改
              </span>
            </div>
            <div className={styles.info}>
              <List>
                <List.Item extra={3434}>身份证号</List.Item>
                <List.Item extra={3434}>行驶证号</List.Item>
                <List.Item extra={3434}>车辆类型</List.Item>
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
                <IdcardForm showbtn={false} onUpload={this.handleChangeImage} />
              </div>
              <div className={styles.item}>
                <CarForm showinfo={false} showbtn={false} onUpload={this.handleChangeImage} />
              </div>
            </Tabs>
          </section>
        </Fragment>
      </DocumentTitle>
    );
  }
}
