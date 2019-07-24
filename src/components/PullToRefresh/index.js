import React, { PureComponent, Fragment } from 'react';
import { PullToRefresh } from 'react-weui';
import 'weui';
import 'react-weui/build/packages/react-weui.css';

export default class PullToRefreshWrap extends PureComponent {
  render() {
    const { children, onRefresh } = this.props;
    return (
      <Fragment>
        <PullToRefresh
          loaderHeight={40}
          onRefresh={resolve => {
            if (onRefresh) {
              setTimeout(() => {
                onRefresh();
                resolve();
              }, 1000);
            }
          }}
        >
          {children}
        </PullToRefresh>
      </Fragment>
    );
  }
}
