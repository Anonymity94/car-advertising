import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input } from 'antd';
import { passwordReg } from '@/utils/utils';

const FormItem = Form.Item;

@Form.create()
@connect()
class PasswordModal extends PureComponent {
  state = {
    confirmDirty: false,
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码不一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { confirmDirty } = this.state;
    const { form } = this.props;
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleSubmit = e => {
    const { form, onSubmit } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const submitData = { ...values };
        delete submitData.confirm;
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
        title={current.id ? '修改' : '新增'}
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
              initialValue: current.id || '',
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="姓名" {...this.formLayout}>
            {current.id
              ? current.name
              : getFieldDecorator('name', {
                  initialValue: current.name || '',
                  validateFirst: true,
                  rules: [{ required: true, whitespace: true, message: '请输入管理员姓名' }],
                })(<Input placeholder="请输入管理员姓名" />)}
          </FormItem>
          <FormItem label="登录账号" {...this.formLayout}>
            {current.id
              ? current.username
              : getFieldDecorator('username', {
                  initialValue: current.username || '',
                  validateFirst: true,
                  rules: [{ required: true, whitespace: true, message: '请输入登录账号' }],
                })(<Input placeholder="请输入登录账号" />)}
          </FormItem>
          <FormItem label="新密码" {...this.formLayout}>
            {getFieldDecorator('password', {
              initialValue: current.password || '',
              validateFirst: true,
              rules: [
                { required: true, message: '请输入新密码' },
                {
                  pattern: passwordReg,
                  message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input.Password placeholder="请输入新密码" />)}
          </FormItem>
          <FormItem label="确认密码" {...this.formLayout}>
            {getFieldDecorator('confirm', {
              initialValue: current.password || '',
              rules: [
                { required: true, message: '请再次输入新密码' },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password placeholder="请再次输入新密码" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default PasswordModal;
