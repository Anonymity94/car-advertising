import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class CreateActivity extends PureComponent {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return <div>新增活动</div>;
  }
}

export default CreateActivity;
