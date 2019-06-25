import React, { PureComponent, Fragment } from 'react';
import { TextareaItem, InputItem, Button, Modal, Flex } from 'antd-mobile';
import { phoneReg } from '@/utils/utils';
import { createForm } from 'rc-form';
import DocumentTitle from 'react-document-title';

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
  class FormContent extends React.Component {
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
      // do ajax get captcha
      // 倒计时
      this.runGetCaptchaCountDown();
    };

    submit = () => {
      const { form, onOk } = this.props;
      form.validateFields((error, values) => {
        if (error) {
          return;
        }
        // 提示一下
        Modal.alert('警告', '确定绑定吗？', [
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
              placeholder="请输入新的手机号码"
              className="required"
              {...getFieldProps('phone', {
                rules: [{ required: true }, { pattern: phoneReg, message: '请输入正确的手机号码' }],
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
                  rules: [{ required: true }],
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
            <p className={styles.title}>申诉理由：</p>
            <TextareaItem
              placeholder="填入申诉理由，不得少于8个字，最多200字（选填）"
              rows={4}
              {...getFieldProps('reason', {
                rules: [{ required: false }],
              })}
            />
          </section>
          <section className={styles.fileid}>
            <Flex style={{ justifyContent: 'space-between' }}>
              <Button style={{ width: '45%' }} className="button-cancel">
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
class BindNewPhone extends PureComponent {
  handleSubmit = values => {
    // TODO: do submit
    console.log(values);
    // 绑定成功，返回首页
    // Modal.alert('绑定成功', '', [{ text: '确定', onPress: () => router.push('/user') }]);
  };

  render() {
    return (
      <DocumentTitle title="更换手机号申诉">
        <section className={styles.bindWrap}>
          <FormWrapper onOk={this.handleSubmit} />
        </section>
      </DocumentTitle>
    );
  }
}

export default BindNewPhone;
