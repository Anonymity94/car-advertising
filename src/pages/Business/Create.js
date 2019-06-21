import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, DatePicker, Modal, Icon } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { phoneReg } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

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

let id = 0;

@Form.create()
@connect()
class CreateBusiness extends PureComponent {
  componentDidMount() {}

  addGoodsItem = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat((id += 1));
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  removeGoodsItem = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  checkGoodName = (rule, value, callback) => {
    const { form } = this.props;
    const businessName = form.getFieldValue('name');
    if (!businessName) {
      callback('请先输入商户名称');
      return;
    }
    if (!value) {
      callback('请输入商品名称');
      return;
    }
    const split = value.split('-');
    if (split.length !== 2 || split[0] !== businessName || !split[1]) {
      callback('以商品名称-商户名称的形式进行命名商品');
      form.validateFields(['name'], { force: true });
      return;
    }
    callback();
  };

  checkBeginTime = (rule, value, callback) => {
    const { form } = this.props;
    const endTime = form.getFieldValue('endTime');
    callback();
  };

  checkEndTime = (rule, value, callback) => {
    const { form } = this.props;
    const beginTime = form.getFieldValue('beginTime');
    callback();
  };

  handleSubmit = event => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields((error, values) => {
      if (error) return;

      const { beginTime, endTime } = values;
      const submitData = {
        ...values,
        beginTime: moment(beginTime).format('YYYY-MM-DD'),
        endTime: moment(endTime).format('YYYY-MM-DD'),
      };

      console.log(submitData);
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

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    const goodsItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '商品' : ''}
        required
        key={k}
      >
        {getFieldDecorator(`good[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          validateFirst: true,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '请输入商品名称',
            },
            { validator: this.checkGoodName },
          ],
        })(<Input placeholder="请输入商品名称" style={{ width: '60%', marginRight: 8 }} />)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.removeGoodsItem(k)}
          />
        ) : null}
        {index === 0 && (
          <span className="ant-form-text" style={{ color: '#cc5a00' }}>
            以商品名称-商户名称的形式进行命名，如红星机油-红星油厂
          </span>
        )}
      </Form.Item>
    ));

    return (
      <PageHeaderWrapper showback>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="商户名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入商户名称',
                  },
                ],
              })(<Input placeholder="请输入商户名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="联系人">
              {getFieldDecorator('contact', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入联系人',
                  },
                ],
              })(<Input placeholder="请输入联系人" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="联系方式">
              {getFieldDecorator('telephone', {
                validateFirst: true,
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入联系方式',
                  },
                  {
                    pattern: phoneReg,
                    message: '请输入正确的手机号',
                  },
                ],
              })(<Input placeholder="请输入联系方式" />)}
            </FormItem>
            <Form.Item label="提供日期" {...formItemLayout}>
              {getFieldDecorator('beginTime', {
                validateFirst: true,
                rules: [
                  { required: true, message: '请选择提供时间' },
                  { validator: this.checkBeginTime },
                ],
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
            <Form.Item label="到期日期" {...formItemLayout}>
              {getFieldDecorator('endTime', {
                validateFirst: true,
                rules: [
                  { required: true, message: '请选择到期时间' },
                  { validator: this.checkEndTime },
                ],
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>

            {/* 提供商品 */}
            {goodsItems}
            {/* 增加地址按钮 */}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.addGoodsItem} style={{ width: '60%' }}>
                <Icon type="plus" /> 新增商品
              </Button>
            </Form.Item>

            <Form.Item label="地址" {...formItemLayout}>
              {getFieldDecorator('address', {
                rules: [{ required: true, whitespace: true, message: '请输入商户地址' }],
              })(<Input.TextArea placeholder="请输入商户地址" rows={4} />)}
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

export default CreateBusiness;
