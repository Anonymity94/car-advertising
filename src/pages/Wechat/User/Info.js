import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';

export default class UserInfo extends PureComponent {
  render() {
    return (
      <DocumentTitle title="用户资料">
        <Fragment>用户资料</Fragment>
      </DocumentTitle>
    );
  }
}
