import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormTemp from './FormTemp';

@connect(({ businessModel: { detail }, loading }) => ({
  detail,
  loading: loading.effects['businessModel/queryBusinessContent'],
  submitLoading: loading.effects['businessModel/updateBusiness'],
}))
class Update extends PureComponent {
  componentDidMount() {
    this.queryBusinessContent();
  }

  queryBusinessContent = () => {
    const { dispatch, match } = this.props;
    const { id } = match.params;
    dispatch({
      type: 'businessModel/queryBusinessContent',
      payload: {
        id,
      },
    });
  };

  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessModel/updateBusiness',
      payload: {
        ...values,
      },
    }).then(success => {
      if (success) {
        this.queryBusinessContent();
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
