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
const { RangePicker } = DatePicker;

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

let id = 0;

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

      // 遍历地址
      const { keys, address, dateRage, content } = values;
      const addressList = [];
      for (let i = 0; i < keys.length; i += 1) {
        addressList.push({
          address: address[i],
          startTime: moment(dateRage[i][0]).format('YYYY-MM-DD'),
          endTime: moment(dateRage[i][1]).format('YYYY-MM-DD'),
        });
      }

      const submitData = {
        ...values,
        content: content.toHTML(),
        addressList,
      };

      // 可能还要处理 banner图片 和 列表图片

      // 删除多于的值
      delete submitData.keys;
      delete submitData.dateRage;
      delete submitData.address;

      console.log(submitData);
    });
  };

  addAddressItem = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat((id += 1));
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
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    const addressItems = keys.map((k, index) => (
      <Row gutter={10} key={k}>
        <Col span={3} className="ant-form-item-label" required>
          {index === 0 ? '地址：' : ''}
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
              })(<Input placeholder="请输入地址" />)}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item>
              {getFieldDecorator(`dateRange[${k}]`, {
                // validateTrigger: ['onChange'],
                rules: [
                  {
                    required: true,
                    message: '请选择起止时间',
                  },
                ],
              })(<RangePicker />)}
            </Form.Item>
          </Col>
          <Col span={4}>
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
      <PageHeaderWrapper showback>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="广告名称">
              {getFieldDecorator('title', {
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
            <FormItem {...formItemLayout} label="列表图片" extra="建议尺寸：4:3比例">
              {getFieldDecorator('cover', {
                valuePropName: 'fileList',
                getValueFromEvent: this.handleCoverChange,
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
                getValueFromEvent: this.handleClauseChange,
                rules: [
                  {
                    required: true,
                    message: '请上传签约条款文件',
                  },
                ],
              })(
                <StandardUpload
                  fileType="file"
                  name="file"
                  listType="text"
                  accept=".pdf"
                  limit={1}
                />
              )}
            </Form.Item>
            <Form.Item label="签约金" {...formItemLayout}>
              {getFieldDecorator('bonus', {
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
                validateFirst: true,
                rules: [
                  { required: true, message: '请输入积分' },
                  { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
                ],
              })(
                <InputNumber
                  // formatter={value => `${Math.ceil(value)}`}
                  placeholder="积分"
                  style={{ width: 160 }}
                  min={1}
                />
              )}
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

export default CreateAD;
