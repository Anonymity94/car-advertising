import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class IntegralList extends PureComponent {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <div>积分列表</div>;
  }
}

export default IntegralList;
