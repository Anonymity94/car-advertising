import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect()
class AdminList extends PureComponent {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <PageHeaderWrapper>
        <div>管理员档案</div>
      </PageHeaderWrapper>
    );
  }
}

export default AdminList;
