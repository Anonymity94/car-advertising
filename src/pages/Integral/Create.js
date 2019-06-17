import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class GoodsIntegral extends PureComponent {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <div>商品积分添加</div>;
  }
}

export default GoodsIntegral;
