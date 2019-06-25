import React, { PureComponent, Fragment } from 'react';
import { InputItem, Button, Modal, Flex } from 'antd-mobile';
import router from 'umi/router';
import { phoneReg, showError } from '@/utils/utils';
import { createForm } from 'rc-form';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';

import styles from './BindPhone.less';

import phoneIcon from './icons/icon_phone@2x.png';
import captchaIcon from './icons/icon_captcha@2x.png';

const iconPorps = {
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  margin: '0 auto',
};

const FormWrapper = createForm()(
  class FormWrapper extends React.Component {
    state = {
      count: 0,
    };

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    runGetCaptchaCountDown = () => {
      let count = 59;
      this.setState({ count });
      this.interval = setInterval(() => {
        count -= 1;
        this.setState({ count });
        if (count === 0) {
          clearInterval(this.interval);
        }
      }, 1000);
    };

    getCaptcha = () => {
      const { form, dispatch } = this.props;
      form.validateFields(['phone']);
      const phoneError = form.getFieldError('phone');
      if (phoneError) {
        showError(phoneError[0]);
        return;
      }

      const phone = form.getFieldValue('phone');

      dispatch({
        type: 'driverModel/getCaptcha',
        payload: {
          phone,
        },
      }).then(success => {
        if (success) {
          this.runGetCaptchaCountDown();
        }
      });
    };

    submit = () => {
      const { form, onOk } = this.props;
      form.validateFields((error, values) => {
        if (error) {
          const errKeys = Object.keys(error);
          showError(error[errKeys[0]].errors[0].message);
          return;
        }
        // 提示一下
        Modal.alert('确定绑定吗？', '', [
          { text: '取消', onPress: () => {} },
          { text: '确定', onPress: () => onOk(values) },
        ]);
      });
    };

    render() {
      const { count } = this.state;
      const { form } = this.props;
      const { getFieldProps } = form;
      return (
        <Fragment>
          <section className={styles.fileid}>
            <InputItem
              placeholder="请输入手机号码"
              className="required"
              {...getFieldProps('phone', {
                validateFirst: true,
                rules: [
                  { required: true, whitespace: true, message: '请输入手机号码' },
                  { pattern: phoneReg, message: '请输入正确的手机号码' },
                ],
              })}
            >
              <div
                className={`${styles.icon}`}
                style={{
                  backgroundImage: `url(${phoneIcon})`,
                  ...iconPorps,
                  width: '21px',
                  height: '23px',
                }}
              />
            </InputItem>
          </section>
          <section className={styles.fileid}>
            <Flex style={{ justifyContent: 'space-between' }}>
              <InputItem
                placeholder="请输入验证码"
                className={`${styles.captchaItem} required`}
                {...getFieldProps('captcha', {
                  validateFirst: true,
                  rules: [{ required: true, whitespace: true, message: '请输入验证码' }],
                })}
              >
                <div
                  className={`${styles.icon}`}
                  style={{
                    backgroundImage: `url(${captchaIcon})`,
                    ...iconPorps,
                    width: '21px',
                    height: '27px',
                  }}
                />
              </InputItem>
              <Button
                inline
                className={styles.captchaBtn}
                disabled={count > 0}
                loading={count > 0}
                onClick={this.getCaptcha}
              >
                {count ? `${count}秒后重试` : '获取验证码'}
              </Button>
            </Flex>
          </section>
          <section className={styles.fileid}>
            <Flex style={{ justifyContent: 'space-between' }}>
              <Button
                style={{ width: '45%' }}
                className="button-cancel"
                onClick={() => router.replace('/h5/home')}
              >
                取消
              </Button>
              <Button style={{ width: '45%' }} className="button-ok" onClick={this.submit}>
                确定
              </Button>
            </Flex>
          </section>
        </Fragment>
      );
    }
  }
);

// eslint-disable-next-line react/no-multi-comp
@connect()
class BindPhone extends PureComponent {
  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/bindPhone',
      payload: { ...values },
    });
  };

  render() {
    const { dispatch } = this.props;
    return (
      <DocumentTitle title="绑定手机号">
        <section className={styles.bindWrap}>
          <FormWrapper dispatch={dispatch} onOk={this.handleSubmit} />
        </section>
      </DocumentTitle>
    );
  }
}

export default BindPhone;
