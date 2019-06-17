import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class ADInfo extends PureComponent {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return <div>更新广告</div>;
  }
}

export default ADInfo;
