import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormTemp from './FormTemp';

@connect(({ activityModel: { detail }, loading }) => ({
  detail,
  loading: loading.effects['activityModel/queryActivityContent'],
  submitLoading: loading.effects['activityModel/updateGoods'],
}))
class Update extends PureComponent {
  componentDidMount() {
    this.queryActivityContent();
  }

  queryActivityContent = () => {
    const { dispatch, match } = this.props;
    const { id } = match.params;
    dispatch({
      type: 'activityModel/queryActivityContent',
      payload: {
        id,
      },
    });
  };

  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityModel/updateActivity',
      payload: {
        ...values,
      },
    }).then(success => {
      if (success) {
        this.queryActivityContent();
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
