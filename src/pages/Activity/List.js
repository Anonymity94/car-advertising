import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class ActivityList extends PureComponent {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <div>活动内容</div>;
  }
}

export default ActivityList;
