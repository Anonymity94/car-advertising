import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Form, Input, Button, DatePicker, Modal, Icon } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { phoneReg, passwordReg } from '@/utils/utils';

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

// 分隔符
const SEPARATOR = '$_o_$_';

let id = 0;

@Form.create()
@connect()
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

  componentDidMount() {}

  addGoodsItem = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(`${SEPARATOR}${(id += 1)}`);
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
    if (!endTime) {
      callback();
      return;
    }
    if (new Date(value) - new Date(endTime) >= 0) {
      callback('提供时间需要早于到期时间');
      return;
    }
    callback();
  };

  checkEndTime = (rule, value, callback) => {
    const { form } = this.props;
    const beginTime = form.getFieldValue('beginTime');
    if (!beginTime) {
      callback();
      return;
    }
    if (new Date(value) - new Date(beginTime) <= 0) {
      callback('到期时间需要晚于提供时间');
      return;
    }
    callback();
  };

  onOk = event => {
    event.preventDefault();
    const { form, onSubmit } = this.props;
    form.validateFields((error, values) => {
      if (error) return;

      const { beginTime, endTime, goods } = values;
      const goodsList = Object.keys(goods).map(key => goods[key]);
      const submitData = {
        ...values,
        goods: goodsList,
        beginTime: moment(beginTime).format('YYYY-MM-DD'),
        endTime: moment(endTime).format('YYYY-MM-DD'),
      };

      delete submitData.keys;

      if (onSubmit) {
        onSubmit(submitData);
      }
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
      values = {}, // 初始值
      submitLoading,
    } = this.props;

    let initKey = [`${SEPARATOR}`];
    const goodsList = values.goods ? values.goods : [];
    if (goodsList.length > 0) {
      initKey = goodsList;
    }

    getFieldDecorator('keys', { initialValue: initKey });
    const keys = getFieldValue('keys');

    const goodsItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '商品' : ''}
        required
        key={k}
        data-key={k}
      >
        {getFieldDecorator(`goods[${k}]`, {
          initialValue: k.name && k.name.indexOf(SEPARATOR) === -1 ? k.name : '',
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
      <Form onSubmit={this.onOk}>
        <FormItem {...formItemLayout} label="id" style={{ display: 'none' }}>
          {getFieldDecorator('id', {
            initialValue: values.id || '',
          })(<Input placeholder="商户id" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="商户名称" extra="商户名称也用作商户登陆名称使用">
          {getFieldDecorator('name', {
            initialValue: values.name || '',
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入商户名称',
              },
            ],
          })(<Input placeholder="请输入商户名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="登录密码" extra="以字母开头，长度在6~18之间，只能包含字母、数字和下划线">
          {getFieldDecorator('password', {
            initialValue: values.password || '',
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入登录密码',
              },
              {
                pattern: passwordReg,
                message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线',
              },
            ],
          })(<Input.Password placeholder="请输入登录密码" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="联系人">
          {getFieldDecorator('contact', {
            initialValue: values.contact || '',
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
            initialValue: values.telephone || '',
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
            initialValue: values.beginTime ? moment(values.beginTime) : undefined,
            validateFirst: true,
            rules: [
              { required: true, message: '请选择提供时间' },
              { validator: this.checkBeginTime },
            ],
          })(<DatePicker format="YYYY-MM-DD" />)}
        </Form.Item>
        <Form.Item label="到期日期" {...formItemLayout}>
          {getFieldDecorator('endTime', {
            initialValue: values.endTime ? moment(values.endTime) : undefined,
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
            initialValue: values.address || '',
            rules: [{ required: true, whitespace: true, message: '请输入商户地址' }],
          })(<Input.TextArea placeholder="请输入商户地址" rows={4} />)}
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
