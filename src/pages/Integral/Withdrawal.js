import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class Withdrawal extends PureComponent {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <div>积分提现</div>;
  }
}

export default Withdrawal;
