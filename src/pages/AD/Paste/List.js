import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class PasteADList extends PureComponent {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return <div>粘贴广告列表</div>;
  }
}

export default PasteADList;
