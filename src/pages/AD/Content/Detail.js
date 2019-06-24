import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class ADInfo extends PureComponent {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return <div>广告内容</div>;
  }
}

export default ADInfo;
