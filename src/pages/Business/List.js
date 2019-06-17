import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class BusinessList extends PureComponent {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <div>商户列表</div>;
  }
}

export default BusinessList;
