/* eslint-disable camelcase */
/* eslint-disable react/sort-comp */
import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Form, Input, Button, DatePicker, Modal, InputNumber, Select } from 'antd';
import BraftEditor from 'braft-editor';
import RichTextEditor from '@/components/BraftEditor';
import StandardUpload from '@/components/StandardUpload';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 16 },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 16, offset: 3 },
    sm: { span: 16, offset: 3 },
  },
};

@Form.create()
@connect(({ loading }) => ({
  loading,
}))
class FormTemp extends PureComponent {
  static propTypes = {
    tpye: PropTypes.oneOf(['create', 'update']), // 新建或修改
    values: PropTypes.object, // 初始值
    submitLoading: PropTypes.bool,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    tpye: 'create',
    values: {},
    submitLoading: false,
    onSubmit: () => {},
  };

  componentDidMount() {
    const { values } = this.props;

    // 异步设置编辑器内容
    setTimeout(() => {
      const { form } = this.props;
      form.setFieldsValue({
        content: BraftEditor.createEditorState(values.content || null),
      });
    }, 0);
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   const { values } = this.props;
  //   const nextValues = nextProps.values;
  //   if (!_.isEqual(values.content, nextValues.content)) {
  //     console.log('old', this.props);
  //     console.log('new', nextProps);
  //     setTimeout(() => {
  //       const { form } = nextProps;
  //       form.setFieldsValue({
  //         content: BraftEditor.createEditorState(nextValues.content || null),
  //       });
  //     }, 0);
  //   }
  // }

  handleContentChange = editorContent => {
    const { form } = this.props;
    form.setFieldsValue({
      content: editorContent,
    });
  };

  onOk = event => {
    event.preventDefault();
    const { form, onSubmit } = this.props;
    form.validateFields((error, values) => {
      if (error) return;

      const { content, image, shopImage } = values;
      console.log('values', values);
      const submitData = {
        ...values,
        content: content.toHTML(),
        image: image[0].url,
        shopImage: shopImage[0].url,
      };

      console.log('submitData', submitData);

      Modal.confirm({
        title: '确定提交吗？',
        keyboard: false,
        maskClosable: false,
        onOk: () => {
          if (onSubmit) {
            onSubmit(submitData);
          }
        },
      });
    });
  };

  handleCancel = () => {
    Modal.confirm({
      title: '确认取消吗？',
      content: '取消后，刚刚操作的内容将不会被保存',
      onOk() {
        router.goBack();
      },
    });
  };

  handleUpload = ({ fileList }) =>
    fileList.map(file => ({
      uid: file.uid,
      name: file.response ? file.response.url : file.url,
      url: file.response ? file.response.url : file.url,
    }));

  render() {
    const {
      form: { getFieldDecorator },
      values = {}, // 初始值
      submitLoading,
    } = this.props;

    return (
      <Form onSubmit={this.onOk}>
        <FormItem {...formItemLayout} label="id" style={{ display: 'none' }}>
          {getFieldDecorator('id', {
            initialValue: values.id || '',
          })(<Input placeholder="商品积分id" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="商品名称">
          {getFieldDecorator('name', {
            initialValue: values.name || undefined,
            rules: [
              {
                required: true,
                message: '请填写商品名称',
              },
            ],
          })(<Input placeholder="请填写商品名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="所属商户名称">
          {values.businessName}
        </FormItem>
        <Form.Item label="到期日期" {...formItemLayout}>
          {values.endTime}
        </Form.Item>

        <Form.Item label="积分" {...formItemLayout}>
          {getFieldDecorator('integral', {
            initialValue: values.integral || undefined,
            validateFirst: true,
            rules: [
              { required: true, message: '请输入积分' },
              { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
            ],
          })(<InputNumber placeholder="积分" style={{ width: 160 }} min={1} />)}
        </Form.Item>
        <FormItem {...formItemLayout} label="商品头图" extra="建议尺寸：16:9比例">
          {getFieldDecorator('image', {
            initialValue: values.image ? [{ uid: values.image, url: values.image }] : [],
            valuePropName: 'fileList',
            getValueFromEvent: this.handleUpload,
            rules: [
              {
                required: true,
                message: '请上传商品头图片',
              },
            ],
          })(<StandardUpload name="image" accept="image/*" limit={1} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="商城页图" extra="建议尺寸：4:3比例">
          {getFieldDecorator('shopImage', {
            initialValue: values.shopImage
              ? [{ uid: values.shopImage, url: values.shopImage }]
              : [],
            valuePropName: 'fileList',
            getValueFromEvent: this.handleUpload,
            rules: [
              {
                required: true,
                message: '请上传商城页图片',
              },
            ],
          })(<StandardUpload name="image" accept="image/*" limit={1} />)}
        </FormItem>
        <Form.Item label="地址" {...formItemLayout}>
          {values.address}
        </Form.Item>

        <Form.Item label="商品详情内容" {...formItemLayout}>
          {getFieldDecorator('content', {
            initialValue: '',
            validateFirst: true,
            rules: [
              { required: true, message: '请输入商品详情内容' },
              {
                validator: (rule, value, callback) => {
                  if (value.isEmpty()) {
                    callback('请输入商品详情内容');
                  } else {
                    callback();
                  }
                },
              },
            ],
            validateTrigger: 'onBlur',
          })(<RichTextEditor onBlur={this.handleContentChange} />)}
        </Form.Item>

        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            提交
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={this.handleCancel} loading={submitLoading}>
            返回
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default FormTemp;
