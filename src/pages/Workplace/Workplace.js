import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, List, Avatar } from 'antd';

import styles from './Workplace.less';

@connect()
class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
  }

  render() {
    return <div>工作台</div>;
  }
}

export default Workplace;
