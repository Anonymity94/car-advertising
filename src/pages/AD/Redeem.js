import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class Redeem extends PureComponent {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <div>积分兑换</div>;
  }
}

export default Redeem;
