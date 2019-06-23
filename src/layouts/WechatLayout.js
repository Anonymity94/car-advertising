import React, { Fragment } from 'react';
import { WingBlank, WhiteSpace } from 'antd-mobile';

import styles from './WechatLayout.less';

export default props => (
  <div className={styles.h5Wrapper}>
    <Fragment>
      <WhiteSpace size="lg" />
      <WingBlank size="lg">
        <div {...props} />
      </WingBlank>
    </Fragment>
  </div>
);
