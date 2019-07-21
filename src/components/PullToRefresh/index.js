import React, { PureComponent } from 'react';
import { PullToRefresh } from 'antd-mobile';

import styles from './index.less';

export default class PullToRefreshWrap extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: document.documentElement.clientHeight,
    };
  }

  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
    console.log(hei)
    setTimeout(
      () =>
        this.setState({
          height: hei,
        }),
      0
    );
  }

  render() {
    const { height } = this.state;
    const { refreshing = false, children, onRefresh } = this.props;
    return (
      <PullToRefresh
        damping={60}
        ref={el => (this.ptr = el)}
        style={{
          height: `${height}px`,
          overflow: 'auto',
        }}
        indicator={{}}
        direction="down"
        refreshing={refreshing}
        onRefresh={() => {
          if (onRefresh) {
            onRefresh();
          }
        }}
      >
        {children}
      </PullToRefresh>
    );
  }
}
