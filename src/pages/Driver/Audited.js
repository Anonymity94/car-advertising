import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class Workplace extends PureComponent {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return <div>已审核</div>;
  }
}

export default Workplace;
