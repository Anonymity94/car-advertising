import React, { Fragment } from 'react';
import { connect } from 'dva';
import { WingBlank, WhiteSpace, LocaleProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import styles from './WechatLayout.less';
import Loading from '@/components/Loading';

export default connect(({ login }) => ({
  wechatUser: login.wechatUser,
}))(props => (
  <div className={styles.h5Wrapper}>
    <Fragment>
      <WhiteSpace size="lg" />
      <WingBlank size="lg">
        <LocaleProvider locale={zhCN}>
          {props.wechatUser.id ? <div {...props} /> : <Loading text="授权中..." />}
        </LocaleProvider>
      </WingBlank>
      <WhiteSpace size="lg" />
    </Fragment>
  </div>
));
