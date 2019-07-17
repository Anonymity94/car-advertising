import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input } from 'antd';
import StandardUpload from '@/components/StandardUpload';

const FormItem = Form.Item;

@Form.create()
@connect()
class PasswordModal extends PureComponent {
  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  // 内容列表 图片上传
  handleUpload = ({ fileList }) => {
    console.log(fileList);
    return fileList.map(file => ({
      uid: file.uid,
      name: file.name || file.response.name,
      url: file.response ? file.response.url : file.url,
    }));
  };

  handleSubmit = e => {
    const { form, onSubmit } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const submitData = {
          ...values,
          settlementImage: values.settlementImage.map(item => item.url),
        };
        onSubmit(submitData);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      confirmLoading,
      onCancel,
      current,
    } = this.props;

    return (
      <Modal
        title="结算"
        width={640}
        destroyOnClose
        maskClosable={false}
        keyboard={false}
        confirmLoading={confirmLoading}
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={onCancel}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="id" style={{ display: 'none' }}>
            {getFieldDecorator('id', {
              initialValue: current.id,
              validateFirst: true,
              rules: [{ required: true, whitespace: true, message: '签约id' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="图片上传" extra="最多上传4张图片">
            {getFieldDecorator('settlementImage', {
              valuePropName: 'fileList',
              getValueFromEvent: this.handleUpload,
              rules: [
                {
                  required: true,
                  message: '请上传图片',
                },
              ],
            })(<StandardUpload type="text" name="image" accept="image/*" limit={4} />)}
          </FormItem>
          <FormItem label="备注" {...this.formLayout}>
            {getFieldDecorator('settlementRemark', {
              validateFirst: true,
              rules: [{ required: false, whitespace: true, message: '请输入备注' }],
            })(<Input.TextArea rows={4} placeholder="备注" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default PasswordModal;
