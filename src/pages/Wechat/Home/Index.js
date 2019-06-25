import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';

export default class Home extends PureComponent {
  render() {
    return (
      <DocumentTitle title="首页">
        <Fragment>首页</Fragment>
      </DocumentTitle>
    );
  }
}
