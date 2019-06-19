import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import BraftEditor from 'braft-editor';
import { connect } from 'dva';
import { Form, Input, Button, Card, Upload, Icon, Row, Col } from 'antd';
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
class CreateAD extends PureComponent {
  componentDidMount() {
    // 异步设置编辑器内容
    setTimeout(() => {
      const { form } = this.props;
      form.setFieldsValue({
        content: BraftEditor.createEditorState(null),
      });
    }, 0);
  }

  handleEditorChange = editorContent => {
    const { form } = this.props;
    form.setFieldsValue({
      content: editorContent,
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const submitData = {
          title: values.title,
          content: values.content.toHTML(), // or values.content.toHTML()
        };
        console.log(submitData);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <PageHeaderWrapper showback>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="广告名称">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入广告名称',
                  },
                ],
              })(<Input placeholder="请输入标题" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="机构名称">
              {getFieldDecorator('company', {
                rules: [
                  {
                    required: true,
                    message: '请输入广告发布机构',
                  },
                ],
              })(<Input placeholder="请输入广告发布机构" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="banner图片" extra="建议尺寸：16:9比例">
              {getFieldDecorator('banner', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                rules: [
                  {
                    required: true,
                    message: '请上传banner图片',
                  },
                ],
              })(
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                >
                  <div>
                    <Icon type={false ? 'loading' : 'plus'} />
                    <div className="ant-upload-text">上传</div>
                  </div>
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="列表图片" extra="建议尺寸：4:3比例">
              {getFieldDecorator('cover', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                rules: [
                  {
                    required: true,
                    message: '请上传列表图片',
                  },
                ],
              })(
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                >
                  <div>
                    <Icon type={false ? 'loading' : 'plus'} />
                    <div className="ant-upload-text">上传</div>
                  </div>
                </Upload>
              )}
            </FormItem>
            <Form.Item label="内容" {...formItemLayout}>
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
              })(<RichTextEditor onBlur={this.handleEditorChange} />)}
            </Form.Item>
            <FormItem {...formItemLayoutWithOutLabel}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button style={{ marginLeft: 10 }}>返回</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CreateAD;
