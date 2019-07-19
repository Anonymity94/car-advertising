import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import FormTemp from './FormTemp';

@connect(({ loading }) => ({
  submitLoading: loading.effects['goodsModel/updateGoods'],
}))
class Create extends PureComponent {
  componentDidMount() {}

  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsModel/updateGoods',
      payload: {
        ...values,
        state: 1,
      },
    }).then(success => {
      if (success) {
        Modal.success({
          title: '新增成功',
          keyboard: false,
          maskClosable: false,
          okText: '返回',
          onOk: () => {
            router.goBack();
          },
        });
      }
    });
  };

  render() {
    const { submitLoading } = this.props;
    return (
      <PageHeaderWrapper showback>
        <Card>
          <FormTemp type="create" onSubmit={this.handleSubmit} submitLoading={submitLoading} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Create;
