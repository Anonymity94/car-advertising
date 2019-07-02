import React, { Component } from 'react';
import { connect } from 'dva';
import Login from '@/components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'admin',
  };

  onTabChange = type => {
    this.setState({ type });

    this.loginForm.resetFields();
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  render() {
    const { type } = this.state;
    const { submitting } = this.props;

    const text = type === 'admin' ? '管理员帐号' : '商户名称';

    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
          onTabChange={this.onTabChange}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="admin" tab="管理员登陆" />
          <Tab key="business" tab="商户登陆" />
          <UserName
            name="username"
            placeholder={`${text}`}
            rules={[
              {
                required: true,
                message: `请输入${text}`,
              },
            ]}
          />
          <Password
            name="password"
            placeholder="登录密码"
            rules={[
              {
                required: true,
                message: '请输入登录密码',
              },
            ]}
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <Submit loading={submitting}>登陆</Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
