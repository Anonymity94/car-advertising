import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { Result } from 'antd-mobile';
import router from 'umi/router';

import waitingIcon from './icons/waiting.svg';

const myImg = src => <img src={src} style={{ width: 60, height: 60 }} alt="" />;

export default class Waiting extends PureComponent {
  render() {
    return (
      <DocumentTitle title="等待结果">
        <Fragment>
          <Result
            style={{ height: 300 }}
            img={myImg(waitingIcon)}
            title="等待处理"
            message="审核时间3-5个工作日，请您耐心等待！"
            buttonText="返回首页"
            buttonType="ghost"
            onButtonClick={() => router.replace('/h5/home')}
          />
        </Fragment>
      </DocumentTitle>
    );
  }
}
