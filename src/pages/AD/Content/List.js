import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class ADList extends PureComponent {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return <div>广告内容列表</div>;
  }
}

export default ADList;
