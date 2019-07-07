import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { Result } from 'antd-mobile';

import styles from './Waiting.less';

import waitingIcon from './icons/waiting@2x.png';

const myImg = src => <img src={src} style={{ width: 60, height: 60 }} alt="" />;

export default class Waiting extends PureComponent {
  render() {
    return (
      <DocumentTitle title="等待审核">
        <Fragment>
          <div className={styles.wrap}>
            <Result
              img={myImg(waitingIcon)}
              title="审核中"
              message="审核时间3-5个工作日，请您耐心等待！"
            />
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}
