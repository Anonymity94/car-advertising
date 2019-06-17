import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class CreateAD extends PureComponent {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return <div>新增广告</div>;
  }
}

export default CreateAD;
