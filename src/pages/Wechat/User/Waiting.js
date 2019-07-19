import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { Result } from 'antd-mobile';

import styles from './Waiting.less';

import waitingIcon from './icons/waiting@2x.png';
import refuseIcon from './icons/refuse@2x.png';

const myImg = src => <img src={src} style={{ width: 60, height: 60 }} alt="" />;

export default class Waiting extends PureComponent {
  render() {
    const {
      location: { query },
    } = this.props;

    const imgUrl = query.type === 'error' ? refuseIcon : waitingIcon;
    const msg = query.msg || '5个工作日，请您耐心等待！';
    const title = query.type === 'error' ? '审核不通过' : '审核中';

    return (
      <DocumentTitle title={title}>
        <Fragment>
          <div className={styles.wrap}>
            <Result img={myImg(imgUrl)} title={title} message={msg} />
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}
