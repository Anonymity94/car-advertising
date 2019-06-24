import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import BraftEditor from 'braft-editor';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Icon,
  Row,
  Col,
  InputNumber,
  DatePicker,
  Modal,
  TimePicker,
  message,
} from 'antd';
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

// 分隔符
const SEPARATOR = '$_o_$_';
let id = 0;

@Form.create()
@connect()
class FormTemp extends PureComponent {
  componentDidMount() {
    // 异步设置编辑器内容
    setTimeout(() => {
      const { form, values = {} } = this.props;
      form.setFieldsValue({
        content: BraftEditor.createEditorState(values.content || null),
      });
    }, 0);
  }

  handleEditorChange = editorContent => {
    const { form } = this.props;
    form.setFieldsValue({
      content: editorContent,
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
    const { form, onSubmit } = this.props;
    form.validateFields((error, values) => {
      if (error) return;

      // 遍历地址
      const {
        keys,
        address,
        startTime,
        endTime,
        content,
        banner,
        signingExpireTime,
        cover,
        clause,
      } = values;
      const addressList = [];

      for (let i = 0; i < keys.length; i += 1) {
        addressList.push({
          address: address[i],
          startTime: moment(startTime[i][0]).format('YYYY-MM-DD'),
          endTime: moment(endTime[i][1]).format('YYYY-MM-DD'),
        });
      }

      const submitData = {
        ...values,
        content: content.toHTML(),
        banner: banner[0].url,
        clause: clause[0].url,
        signingExpireTime: moment(signingExpireTime).format('YYYY-MM-DD'),
        cover: cover.map(item => item.url),
        address: addressList,
      };

      // 删除多于的值
      delete submitData.keys;
      delete submitData.endTime;
      delete submitData.startTime;

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

  addAddressItem = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(`${SEPARATOR}${(id += 1)}`);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  removeAddressItem = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  handleUploadChange = ({ fileList }) =>
    fileList.map(file => ({
      uid: file.uid,
      name: file.response ? file.response.url : file.url,
      url: file.response ? file.response.url : file.url,
    }));

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      values = {}, // 初始值
      submitLoading,
    } = this.props;

    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    const addressItems = keys.map((k, index) => (
      <Row gutter={10} key={k}>
        <Col span={3} className="ant-form-item-label" required>
          {index === 0 ? '广告粘贴地址：' : ''}
        </Col>
        <Col span={20}>
          <Col span={10}>
            <Form.Item>
              {getFieldDecorator(`address[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入地址',
                  },
                ],
              })(<Input.TextArea rows={1} placeholder="请输入地址" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item style={{ display: 'inline-block' }}>
              <span className="ant-form-text">营业时间</span>
              {getFieldDecorator(`startTime[${k}]`, {
                validateTrigger: ['onChange'],
                rules: [
                  {
                    required: true,
                    message: '请选择营业开始时间',
                  },
                  {
                    validator: (rule, value, callback) => {
                      const { form } = this.props;
                      const endTime = form.getFieldValue(`endTime[${k}]`);
                      if (!endTime) {
                        callback();
                        return;
                      }
                      if (new Date(value) - new Date(endTime) >= 0) {
                        callback('营业开始时间需要早于结束时间');
                        return;
                      }
                      callback();
                    },
                  },
                ],
              })(<TimePicker placeholder="开始时间" format="HH:mm" minuteStep={30} />)}
            </Form.Item>
            <Form.Item style={{ display: 'inline-block', marginLeft: 10 }}>
              {getFieldDecorator(`endTime[${k}]`, {
                validateTrigger: ['onChange'],
                rules: [
                  {
                    required: true,
                    message: '请选择营业结束时间',
                  },
                  {
                    validator: (rule, value, callback) => {
                      const { form } = this.props;
                      const beginTime = form.getFieldValue(`beginTime${[k]}`);
                      if (!beginTime) {
                        callback();
                        return;
                      }
                      if (new Date(value) - new Date(beginTime) <= 0) {
                        callback('营业结束时间需要晚于开始时间');
                        return;
                      }
                      callback();
                    },
                  },
                ],
              })(<TimePicker placeholder="结束时间" format="HH:mm" minuteStep={30} />)}
            </Form.Item>
          </Col>
          <Col span={2}>
            {keys.length > 1 ? (
              <Form.Item>
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.removeAddressItem(k)}
                />
              </Form.Item>
            ) : null}
          </Col>
        </Col>
      </Row>
    ));

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="id" style={{ display: 'none' }}>
          {getFieldDecorator('id', {
            initialValue: values.id || '',
          })(<Input placeholder="id" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="广告名称">
          {getFieldDecorator('title', {
            initialValue: values.title || '',
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入广告名称',
              },
            ],
          })(<Input placeholder="请输入标题" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="机构名称">
          {getFieldDecorator('company', {
            initialValue: values.company || '',
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入广告发布机构',
              },
            ],
          })(<Input placeholder="请输入广告发布机构" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="banner图片" extra="建议尺寸：16:9比例">
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
          })(<StandardUpload name="image" accept="image/*" limit={1} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="列表图片" extra="建议尺寸：4:3比例">
          {getFieldDecorator('cover', {
            initialValue: Array.isArray(values.cover)
              ? values.cover.map(url => ({ uid: url, url }))
              : [],
            valuePropName: 'fileList',
            getValueFromEvent: this.handleUploadChange,
            rules: [
              {
                required: true,
                message: '请上传列表图片',
              },
            ],
          })(<StandardUpload name="image" accept="image/*" limit={3} />)}
        </FormItem>
        <Form.Item label="签约条款" {...formItemLayout}>
          {getFieldDecorator('clause', {
            valuePropName: 'fileList',
            getValueFromEvent: this.handleUploadChange,
            rules: [
              {
                required: true,
                message: '请上传签约条款文件',
              },
            ],
          })(
            <StandardUpload fileType="file" name="file" listType="text" accept=".pdf" limit={1} />
          )}
        </Form.Item>
        <Form.Item label="签约有效期" {...formItemLayout}>
          {getFieldDecorator('signingExpireTime', {
            initialValue: values.signingExpireTime ? moment(values.signingExpireTime) : undefined,
            validateFirst: true,
            rules: [{ required: false, message: '请选择签约有效期' }],
          })(<DatePicker format="YYYY-MM-DD" />)}
        </Form.Item>
        <Form.Item label="签约金" {...formItemLayout}>
          {getFieldDecorator('bonus', {
            initialValue: values.bonus || undefined,
            validateFirst: true,
            rules: [
              { required: true, message: '请输入签约金' },
              { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
            ],
          })(<InputNumber style={{ width: 160 }} min={1} />)}
          <span className="ant-form-text"> 元/月</span>
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
        <Form.Item label="积分说明" {...formItemLayout}>
          {getFieldDecorator('remark', {
            initialValue: values.remark || undefined,
            validateFirst: true,
            rules: [
              { required: true, whitespace: true, message: '请输入积分说明' },
              { max: 512, message: '最长限制512个字符' },
            ],
          })(<Input.TextArea rows={3} placeholder="请输入积分说明，最长限制512个字符" />)}
        </Form.Item>

        {/* 地址 */}
        {addressItems}
        {/* 增加地址按钮 */}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.addAddressItem} style={{ width: '60%' }}>
            <Icon type="plus" /> 新增地址
          </Button>
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

export default FormTemp;
