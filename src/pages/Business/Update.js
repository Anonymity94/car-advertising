import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Modal, Input } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormTemp from './FormTemp';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const CreateGoodsForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { business, goodsList, visible, onCancel, onCreate, form, loading } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          destroyOnClose
          confirmLoading={loading}
          title="新增商品"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form {...formItemLayout}>
            <Form.Item label="商户id" style={{ display: 'none' }}>
              {getFieldDecorator('businessId', {
                initialValue: business.id || '',
                rules: [{ required: true, message: '商户不能为空' }],
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item label="商户">
              {getFieldDecorator('businessName', {
                initialValue: business.name || '',
                rules: [{ required: true, message: '商户不能为空' }],
              })(<Input readOnly />)}
            </Form.Item>
          </Form>
          <Form {...formItemLayout}>
            <Form.Item label="商品名称">
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: '请输入商品名称' },
                  {
                    validator: (_, value, callback) => {
                      if (goodsList.find(item => item.name === value)) {
                        callback('商品名称不能重复');
                        return;
                      }
                      callback();
                    },
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

// eslint-disable-next-line react/no-multi-comp
@connect(({ businessModel: { detail }, goodsModel: { list: goodsList }, loading }) => ({
  detail,
  goodsList,
  loading: loading.effects['businessModel/queryBusinessContent'],
  submitLoading: loading.effects['businessModel/updateBusiness'],
  createGoodsLoading: loading.effects['goodsModel/createGoods'],
}))
class Update extends PureComponent {
  state = {
    visible: false,
  };

  componentDidMount() {
    this.queryBusinessContent();
    this.queryBusinessGoods();
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

  queryBusinessGoods = () => {
    const { dispatch, match } = this.props;
    const { id } = match.params;
    dispatch({
      type: 'goodsModel/queryGoods',
      payload: {
        businessId: id,
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

  // ---- 处理商品----
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleShow = () => {
    this.setState({
      visible: true,
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleCreate = () => {
    const { dispatch } = this.props;
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      dispatch({
        type: 'goodsModel/createGoods',
        payload: values,
      }).then(success => {
        if (success) {
          this.handleCancel();
          this.queryBusinessGoods();
        }
      });
    });
  };

  handleDelGoods = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsModel/deleteGoods',
      payload: { id },
    }).then(success => {
      if (success) {
        this.queryBusinessGoods();
      }
    });
  };

  render() {
    const { visible } = this.state;
    const { loading, createGoodsLoading, detail, goodsList, submitLoading } = this.props;
    return (
      <PageHeaderWrapper showback>
        <Card loading={loading}>
          <FormTemp
            values={detail}
            goods={goodsList}
            submitLoading={submitLoading}
            onCreateGoods={this.handleShow}
            onDelGoods={this.handleDelGoods}
            onSubmit={this.handleSubmit}
          />
        </Card>

        <CreateGoodsForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          business={detail}
          goodsList={goodsList}
          loading={createGoodsLoading}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Update;
