import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import BraftEditor from 'braft-editor';
import { connect } from 'dva';
import { Form, Input, Button, DatePicker, Modal } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import StandardUpload from '@/components/StandardUpload';
import RichTextEditor from '@/components/BraftEditor';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 20, offset: 3 },
    sm: { span: 20, offset: 3 },
  },
};

@Form.create()
@connect()
class CreateActivity extends PureComponent {
  componentDidMount() {
    // 异步设置编辑器内容
    setTimeout(() => {
      const { form, values = {} } = this.props;
      form.setFieldsValue({
        content: BraftEditor.createEditorState(values.content || null),
        participation: BraftEditor.createEditorState(values.participation || null),
      });
    }, 0);
  }

  handleContentChange = editorContent => {
    const { form } = this.props;
    form.setFieldsValue({
      content: editorContent,
    });
  };

  handleParticipationChange = editorContent => {
    const { form } = this.props;
    form.setFieldsValue({
      participation: editorContent,
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

  onOk = event => {
    event.preventDefault();
    const { form, onSubmit } = this.props;
    form.validateFields((error, values) => {
      if (error) return;

      const { participation, content, activityTime, banner } = values;
      const submitData = {
        ...values,
        participation: participation.toHTML(),
        content: content.toHTML(),
        activityTime: moment(activityTime).format('YYYY-MM-DD'),
        banner: banner[0].url,
      };

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

  handleUploadChange = ({ fileList }) =>
    fileList.map(file => ({
      uid: file.uid,
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
          })(<Input placeholder="id" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="活动标题">
          {getFieldDecorator('title', {
            initialValue: values.title || '',
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入活动标题',
              },
            ],
          })(<Input placeholder="请输入活动标题" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="活动主办方">
          {getFieldDecorator('company', {
            initialValue: values.company || '',
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入活动主办方',
              },
            ],
          })(<Input placeholder="请输入活动主办方" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="banner图片" extra="建议尺寸：4:3比例">
          {getFieldDecorator('banner', {
            initialValue: values.banner ? [{ uid: values.banner, url: values.banner }] : [],
            valuePropName: 'fileList',
            getValueFromEvent: this.handleUploadChange,
            rules: [
              {
                required: true,
                message: '请上传banner图片',
              },
            ],
          })(<StandardUpload accept="image/*" limit={1} />)}
        </FormItem>
        <Form.Item label="活动时间" {...formItemLayout}>
          {getFieldDecorator('activityTime', {
            initialValue: values.activityTime ? moment(values.activityTime) : undefined,
            validateFirst: true,
            rules: [{ required: true, message: '请选择活动时间' }],
          })(<DatePicker format="YYYY-MM-DD" />)}
        </Form.Item>
        <Form.Item label="活动内容" {...formItemLayout}>
          {getFieldDecorator('content', {
            validateFirst: true,
            rules: [
              { required: true, message: '请输入内容' },
              {
                validator: (_, value, callback) => {
                  if (value.isEmpty()) {
                    callback('请输入内容');
                  } else {
                    callback();
                  }
                },
              },
            ],
            validateTrigger: 'onBlur',
          })(<RichTextEditor onBlur={this.handleContentChange} />)}
        </Form.Item>
        <Form.Item label="参与方式" {...formItemLayout}>
          {getFieldDecorator('participation', {
            validateFirst: true,
            rules: [
              { required: true, message: '请输入参与方式' },
              {
                validator: (_, value, callback) => {
                  if (value.isEmpty()) {
                    callback('请输入参与方式');
                  } else {
                    callback();
                  }
                },
              },
            ],
            validateTrigger: 'onBlur',
          })(<RichTextEditor onBlur={this.handleParticipationChange} />)}
        </Form.Item>

        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            提交
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={this.handleCancel}>
            返回
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default CreateActivity;
