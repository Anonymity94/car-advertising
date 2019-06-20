import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import BraftEditor from 'braft-editor';
import { connect } from 'dva';
import { Form, Input, Button, Card, Icon, Row, Col, InputNumber, DatePicker, Modal } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import StandardUpload from '@/components/StandardUpload';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
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
      const { form } = this.props;
      form.setFieldsValue({
        content: BraftEditor.createEditorState(null),
        participation: BraftEditor.createEditorState(null),
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

  handleSubmit = event => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields((error, values) => {
      if (error) return;

      const { participation, content, activityTime } = values;
      const submitData = {
        ...values,
        participation: participation.toHTML(),
        content: content.toHTML(),
        activityTime: moment(activityTime).format('YYYY-MM-DD'),
      };

      // 可能还要处理 banner图片 和 列表图片

      console.log(submitData);
    });
  };

  // banner 图片上传
  handleBannerChange = ({ fileList }) =>
    fileList.map(file => ({
      uid: file.uid,
      name: file.name || file.response.name,
      url: file.response ? file.response.url : file.url,
    }));

  // 内容列表 图片上传
  handleCoverChange = ({ fileList }) => {
    console.log(fileList);
    return fileList.map(file => ({
      uid: file.uid,
      name: file.name || file.response.name,
      url: file.response ? file.response.url : file.url,
    }));
  };

  // 签约条款文件
  handleClauseChange = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <PageHeaderWrapper showback>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="活动标题">
              {getFieldDecorator('title', {
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
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入活动主办方',
                  },
                ],
              })(<Input placeholder="请输入活动主办方" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="banner图片" extra="建议尺寸：16:9比例">
              {getFieldDecorator('banner', {
                valuePropName: 'fileList',
                getValueFromEvent: this.handleBannerChange,
                rules: [
                  {
                    required: true,
                    message: '请上传banner图片',
                  },
                ],
              })(<StandardUpload name="image" accept="image/*" limit={1} />)}
            </FormItem>
            <Form.Item label="活动时间" {...formItemLayout}>
              {getFieldDecorator('activityTime', {
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
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button style={{ marginLeft: 10 }} onClick={this.handleCancel}>
                返回
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CreateActivity;
