import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';

export default class AdSettlement extends PureComponent {
  render() {
    return (
      <DocumentTitle title="结算记录">
        <Fragment>结算记录</Fragment>
      </DocumentTitle>
    );
  }
}
