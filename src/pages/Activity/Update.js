import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class UpdateActivity extends PureComponent {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <div>活动内容详情</div>;
  }
}

export default UpdateActivity;
