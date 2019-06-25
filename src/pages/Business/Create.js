import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import FormTemp from './FormTemp';

@connect(({ loading }) => ({
  submitLoading: loading.effects['businessModel/createBusiness'],
}))
class Create extends PureComponent {
  componentDidMount() {}

  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessModel/createBusiness',
      payload: {
        ...values,
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
          <FormTemp onSubmit={this.handleSubmit} submitLoading={submitLoading} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Create;
