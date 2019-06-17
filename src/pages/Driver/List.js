import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class Workplace extends PureComponent {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <div>审核人员管理列表</div>;
  }
}

export default Workplace;
