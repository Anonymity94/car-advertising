import React, { PureComponent, Fragment } from 'react';
import { TextareaItem, InputItem, Button, Modal, Flex, Toast } from 'antd-mobile';
import { connect } from 'dva';
import router from 'umi/router';
import { createForm } from 'rc-form';
import DocumentTitle from 'react-document-title';
import { phoneReg, showError } from '@/utils/utils';

import styles from './style.less';

import phoneIcon from './icons/icon_phone@2x.png';
import captchaIcon from './icons/icon_captcha@2x.png';
import Empty from '@/components/Empty';

const iconPorps = {
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  margin: '0 auto',
};

const FormWrapper = createForm()(
  class FormContent extends React.Component {
    state = {
      count: 0,
      phoneCaptcha: '',
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

    checkNewPhone = (rule, value, callback) => {
      const { form } = this.props;
      const oldPhone = form.getFieldValue('oldPhone');
      if (value && value === oldPhone) {
        callback('新手机不能和旧手机相同');
        return;
      }
      callback();
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
      }).then(({ success, captcha }) => {
        if (success) {
          this.runGetCaptchaCountDown();
        }
        this.setState({
          phoneCaptcha: captcha,
        });
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
        // 判断下验证码
        const { phoneCaptcha } = this.state;
        if (phoneCaptcha !== values.captcha) {
          Toast.fail('验证码错误', 1);
          return;
        }

        // 提示一下
        Modal.alert('确定提交申诉吗？', '', [
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
        <div className={styles.formWrap}>
          <section className={styles.field}>
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
          <section className={styles.field}>
            <InputItem
              placeholder="请输入新手机号码"
              className="required"
              {...getFieldProps('phone', {
                validateFirst: true,
                rules: [
                  { required: true, whitespace: true, message: '请输入新手机号码' },
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
          <section className={styles.field}>
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
          <section className={styles.field}>
            <p className={styles.title}>申诉理由：</p>
            <TextareaItem
              placeholder="填写申诉理由，不得少于8个字，最多200字（选填）"
              rows={4}
              {...getFieldProps('reason', {
                rules: [
                  { required: false, whitespace: true, message: '请填写申诉理由' },
                  { min: 8, message: '申诉理由不得少于8个字' },
                  { max: 200, message: '申诉理由最多200字' },
                ],
              })}
            />
          </section>
          <section className={styles.field}>
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
        </div>
      );
    }
  }
);

// eslint-disable-next-line react/no-multi-comp
@connect(({ login: { wechatUser }, wechatModel: { openId } }) => ({
  wechatUser,
  openId,
}))
class Appeal extends PureComponent {
  handleSubmit = values => {
    const { dispatch, wechatUser, openId } = this.props;
    dispatch({
      type: 'appealModel/createAppeal',
      payload: { ...values, userId: wechatUser.id, name: wechatUser.username, openId },
    });
  };

  render() {
    const { dispatch, wechatUser } = this.props;
    return (
      <DocumentTitle title="更换手机号申诉">
        <section>
          {!wechatUser.id ? (
            <Fragment>
              <Empty text="您还没有注册" />
              <Button
                className="button-ok"
                style={{ marginTop: 10 }}
                onClick={() => router.push('/h5/user/register')}
              >
                立马注册
              </Button>
            </Fragment>
          ) : (
            <FormWrapper dispatch={dispatch} onOk={this.handleSubmit} />
          )}
        </section>
      </DocumentTitle>
    );
  }
}

export default Appeal;
