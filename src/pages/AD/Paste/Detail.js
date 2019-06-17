import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class PasteADInfo extends PureComponent {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <div>粘贴广告详情</div>;
  }
}

export default PasteADInfo;
