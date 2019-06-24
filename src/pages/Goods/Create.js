import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import FormTemp from './FormTemp';

@connect(({ loading }) => ({
  submitLoading: loading.effects['goodsModel/createGoods'],
}))
class Create extends PureComponent {
  componentDidMount() {}

  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsModel/createGoods',
      payload: {
        ...values,
      },
    }).then(success => {
      if (success) {
        Modal.success({
          title: '新增成功',
          keyboard: false,
          maskClosable: false,
          okText: '继续添加',
          onOk: () => {
            this.formRef.props.form.resetFields();
          },
          cancelText: '返回',
          onCancel: () => {
            router.goBack();
          },
        });
      }
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { submitLoading } = this.props;
    return (
      <PageHeaderWrapper showback>
        <Card>
          <FormTemp
            wrappedComponentRef={this.saveFormRef}
            onSubmit={this.handleSubmit}
            submitLoading={submitLoading}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Create;
