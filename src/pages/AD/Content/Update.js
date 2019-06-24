import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormTemp from './FormTemp';

@connect(({ adModel: { detail }, loading }) => ({
  detail,
  loading: loading.effects['adModel/queryAdContent'],
  submitLoading: loading.effects['adModel/updateAd'],
}))
class Update extends PureComponent {
  componentDidMount() {
    this.queryAdContent();
  }

  queryAdContent = () => {
    const { dispatch, match } = this.props;
    const { id } = match.params;
    dispatch({
      type: 'adModel/queryAdContent',
      payload: {
        id,
      },
    });
  };

  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adModel/updateAd',
      payload: {
        ...values,
      },
    }).then(success => {
      if (success) {
        this.queryAdContent();
      }
    });
  };

  render() {
    const { loading, detail, submitLoading } = this.props;
    return (
      <PageHeaderWrapper showback>
        <Card loading={loading}>
          <FormTemp values={detail} submitLoading={submitLoading} onSubmit={this.handleSubmit} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Update;
