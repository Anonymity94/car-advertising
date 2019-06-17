import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class ActivityInfo extends PureComponent {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <div>活动详情</div>;
  }
}

export default ActivityInfo;
