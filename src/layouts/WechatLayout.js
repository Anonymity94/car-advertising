import React, { Fragment } from 'react';
import { WingBlank, WhiteSpace, LocaleProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import styles from './WechatLayout.less';

export default props => (
  <div className={styles.h5Wrapper}>
    <Fragment>
      <WhiteSpace size="lg" />
      <WingBlank size="lg">
        <LocaleProvider locale={zhCN}>
          <div {...props} />
        </LocaleProvider>
      </WingBlank>
    </Fragment>
  </div>
);
