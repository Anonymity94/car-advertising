import React, { Fragment } from 'react';
import { connect } from 'dva';
import { WingBlank, WhiteSpace, LocaleProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import styles from './WechatLayout.less';
import Loading from '@/components/Loading';

export default connect(({ wechatModel }) => ({
  checkWechatLoginFinish: wechatModel.checkWechatLoginFinish,
}))(props => (
  <div className={styles.h5Wrapper}>
    <Fragment>
      <WingBlank size="lg">
        <LocaleProvider locale={zhCN}>
          <Fragment>
            <WhiteSpace size="lg" />
            {IS_DEV && <div {...props} />}
            {!IS_DEV &&
              (props.checkWechatLoginFinish ? <div {...props} /> : <Loading text="授权中..." />)}
          </Fragment>
        </LocaleProvider>
      </WingBlank>
    </Fragment>
  </div>
));
