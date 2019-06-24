import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormTemp from './FormTemp';

@connect(({ goodsModel: { detail }, loading }) => ({
  detail,
  loading: loading.effects['goodsModel/queryGoodsContent'],
  submitLoading: loading.effects['goodsModel/updateGoods'],
}))
class Update extends PureComponent {
  componentDidMount() {
    this.queryGoodsContent();
  }

  queryGoodsContent = () => {
    const { dispatch, match } = this.props;
    const { id } = match.params;
    dispatch({
      type: 'goodsModel/queryGoodsContent',
      payload: {
        id,
      },
    });
  };

  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsModel/updateGoods',
      payload: {
        ...values,
      },
    }).then(success => {
      if (success) {
        this.queryGoodsContent();
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
