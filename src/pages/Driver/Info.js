import React, { PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const UserDetail = React.lazy(() => import('./UserDetail'));

@connect(({ driverModel: { detail }, loading }) => ({
  detail,
  loading: loading.effects['driverModel/queryDriverDetail'],
}))
class Info extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: 'driverModel/queryDriverDetail',
      payload: {
        id: params.id,
      },
    });
  }

  componentWillUnmount() {}

  render() {
    const { loading, detail } = this.props;

    return (
      <PageHeaderWrapper showback>
        <Suspense fallback={null}>
          <UserDetail detail={detail} loading={loading} />
        </Suspense>
      </PageHeaderWrapper>
    );
  }
}

export default Info;
