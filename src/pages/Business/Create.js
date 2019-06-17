import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class CreateBusiness extends PureComponent {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <div>新增商户</div>;
  }
}

export default CreateBusiness;
