import React, { PureComponent, Fragment } from 'react';
import { InputItem, Button, Modal, Flex } from 'antd-mobile';
import { phoneReg, showError } from '@/utils/utils';
import Link from 'umi/link';
import router from 'umi/router';
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
      oldCount: 0,
      count: 0,
    };

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    runGetCaptchaCountDown = stateKey => {
      let count = 59;
      this.setState({ [stateKey]: count });
      this[`${stateKey}_interval`] = setInterval(() => {
        count -= 1;
        this.setState({ [stateKey]: count });
        if (count === 0) {
          clearInterval(this[`${stateKey}_interval`]);
        }
      }, 1000);
    };

    checkNewPhone = (rule, value, callback) => {
      const { form } = this.props;
      const oldPhone = form.getFieldValue('oldPhone');
      if (value && value === oldPhone) {
        callback('新手机不能和旧手机相同');
        return;
      }
      callback();
    };

    getCaptcha = field => {
      const { form, dispatch } = this.props;
      form.validateFields([field]);
      const phoneError = form.getFieldError(field);
      if (phoneError) {
        showError(phoneError[0]);
        return;
      }

      const phone = form.getFieldValue(field);

      dispatch({
        type: 'driverModel/getCaptcha',
        payload: {
          phone,
        },
      }).then(success => {
        if (success) {
          const stateKey = field === 'oldPhone' ? 'oldCount' : 'count';
          this.runGetCaptchaCountDown(stateKey);
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
        Modal.alert('确定更换手机号吗？', '', [
          { text: '取消', onPress: () => {} },
          { text: '确定', onPress: () => onOk(values) },
        ]);
      });
    };

    render() {
      const { count, oldCount } = this.state;
      const { form } = this.props;
      const { getFieldProps } = form;
      return (
        <Fragment>
          <section className={styles.fileid}>
            <InputItem
              placeholder="请输入旧手机号码"
              className="required"
              {...getFieldProps('oldPhone', {
                validateFirst: true,
                rules: [
                  { required: true, whitespace: true, message: '请输入旧手机号码' },
                  { pattern: phoneReg, message: '请输入正确的旧手机号码' },
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
          <section className={styles.fileid} style={{ marginBottom: 10 }}>
            <Flex style={{ justifyContent: 'space-between' }}>
              <InputItem
                placeholder="请输入验证码"
                className={`${styles.captchaItem} required`}
                {...getFieldProps('oldCaptcha', {
                  validateFirst: true,
                  rules: [{ required: true, whitespace: true, message: '请输入旧手机的验证码' }],
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
                disabled={oldCount > 0}
                loading={oldCount > 0}
                onClick={() => this.getCaptcha('oldPhone')}
              >
                {oldCount ? `${oldCount}秒后重试` : '获取验证码'}
              </Button>
            </Flex>
          </section>
          <section className={styles.fileid}>
            <Link to="/h5/user/appeal">
              <p>若旧手机无法收到验证码，可点击此处提起申诉流程！</p>
            </Link>
          </section>
          <section className={styles.fileid}>
            <InputItem
              placeholder="请输入新的手机号码"
              className="required"
              {...getFieldProps('phone', {
                validateFirst: true,
                rules: [
                  { required: true, whitespace: true, message: '请输入新的手机号码' },
                  { pattern: phoneReg, message: '请输入正确的新手机号码' },
                  { validator: this.checkNewPhone },
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
                  rules: [{ required: true, whitespace: true, message: '请输入新手机的验证码' }],
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
                onClick={() => this.getCaptcha('phone')}
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
class ChangePhone extends PureComponent {
  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/changePhone',
      payload: { ...values },
    });
  };

  render() {
    const { dispatch } = this.props;
    return (
      <DocumentTitle title="更换手机号">
        <section className={styles.bindWrap}>
          <FormWrapper dispatch={dispatch} onOk={this.handleSubmit} />
        </section>
      </DocumentTitle>
    );
  }
}

export default ChangePhone;
