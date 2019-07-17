import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input } from 'antd';
import StandardUpload from '@/components/StandardUpload';

// 允许粘贴广告
export const ACCESS_PASTE = 'access';
// 拒绝粘贴广告
export const REJECT_PASTE = 'reject';

const FormItem = Form.Item;

@Form.create()
@connect()
class PasswordModal extends PureComponent {
  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  // 内容列表 图片上传
  handleUpload = ({ fileList }) => fileList.map(file => ({
      uid: file.uid,
      name: file.name || file.response.name,
      url: file.response ? file.response.url : file.url,
    }));

  handleSubmit = e => {
    const { form, onSubmit } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const submitData = {
          ...values,
          pasteImages: values.pasteImages.map(item => item.url),
        };
        onSubmit(submitData);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      operateType = '',
      confirmLoading,
      onCancel,
      current,
    } = this.props;

    const descText = operateType === REJECT_PASTE ? '理由' : '备注';

    return (
      <Modal
        title={operateType === REJECT_PASTE ? '拒绝粘贴' : '允许粘贴'}
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
            {getFieldDecorator('pasteImages', {
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
          <FormItem label={descText} {...this.formLayout}>
            {getFieldDecorator('pasteRemark', {
              validateFirst: true,
              rules: [{ required: false, whitespace: true, message: `请输入${descText}` }],
            })(<Input.TextArea rows={4} placeholder={`${descText} `} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default PasswordModal;
