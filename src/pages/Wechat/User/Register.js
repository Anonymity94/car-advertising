/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-stateless-function */
import React, { PureComponent, Fragment, memo } from 'react';
import { InputItem, Button, Modal, Steps, WhiteSpace } from 'antd-mobile';
import router from 'umi/router';
import { phoneReg, showError } from '@/utils/utils';
import { createForm } from 'rc-form';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';

import styles from './style.less';

import userIcon from './icons/icon_user@2x.png';
import idcardIcon from './icons/icon_idcard@2x.png';
import phoneIcon from './icons/icon_phone@2x.png';

const iconPorps = {
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  margin: '0 auto',
};

const steps = [
  {
    key: 0,
    title: '资料填写',
  },
  {
    key: 1,
    title: '身份验证',
  },
  {
    key: 2,
    title: '车辆登记',
  },
];

const STEP_0_FORM_REF = 'step_0_form';
const STEP_1_FORM_REF = 'step_1_form';
const STEP_2_FORM_REF = 'step_2_form';

const Step0Form = createForm()(
  class FormWrapper extends React.Component {
    render() {
      const { form } = this.props;
      const { onOk } = this.props;
      const { getFieldProps } = form;
      return (
        <div className={styles.formWrap}>
          <section className={styles.fileid}>
            <InputItem
              placeholder="请输入您的姓名（不可修改）"
              className="required"
              {...getFieldProps('username', {
                validateFirst: true,
                rules: [{ required: true, whitespace: true, message: '请输入您的姓名' }],
              })}
            >
              <div
                className={`${styles.icon}`}
                style={{
                  backgroundImage: `url(${userIcon})`,
                  ...iconPorps,
                  width: '23px',
                  height: '23px',
                }}
              />
            </InputItem>
          </section>
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
            <InputItem
              placeholder="请输入您的身份证号"
              className="required"
              {...getFieldProps('idcard', {
                validateFirst: true,
                rules: [{ required: true, whitespace: true, message: '请输入您的身份证号' }],
              })}
            >
              <div
                className={`${styles.icon}`}
                style={{
                  backgroundImage: `url(${idcardIcon})`,
                  ...iconPorps,
                  width: '21px',
                  height: '27px',
                }}
              />
            </InputItem>
          </section>
          <section className={styles.fileid}>
            <Button className="button-ok" onClick={onOk}>
              下一步
            </Button>
          </section>
        </div>
      );
    }
  }
);

const Step1Form = createForm()(
  class FormWrapper extends React.Component {
    render() {
      const { form } = this.props;
      const { onOk } = this.props;
      const { getFieldProps } = form;
      return (
        <div className={styles.formWrap}>
          <section className={styles.fileid}>身份证正面</section>
          <section className={styles.fileid}>身份证反面</section>
          <section className={styles.fileid}>
            <Button className="button-ok" onClick={onOk}>
              下一步
            </Button>
          </section>
        </div>
      );
    }
  }
);

const Step2Form = createForm()(
  class FormWrapper extends React.Component {
    render() {
      const { form } = this.props;
      const { onOk } = this.props;
      const { getFieldProps } = form;
      return (
        <div className={styles.formWrap}>
          <section className={styles.fileid}>
            <InputItem
              placeholder="请输入车辆类型"
              className="required"
              {...getFieldProps('carType', {
                validateFirst: true,
                rules: [{ required: true, whitespace: true, message: '请输入车辆类型' }],
              })}
            >
              <div
                className={`${styles.icon}`}
                style={{
                  backgroundImage: `url(${userIcon})`,
                  ...iconPorps,
                  width: '23px',
                  height: '23px',
                }}
              />
            </InputItem>
          </section>
          <section className={styles.fileid}>
            <InputItem
              placeholder="请输入行驶证号"
              className="carcode"
              {...getFieldProps('phone', {
                validateFirst: true,
                rules: [{ required: true, whitespace: true, message: '请输入行驶证号' }],
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
            <InputItem
              placeholder="请输入证件到期时间"
              className="required"
              {...getFieldProps('expireTime', {
                validateFirst: true,
                rules: [{ required: true, whitespace: true, message: '请输入证件到期时间' }],
              })}
            >
              <div
                className={`${styles.icon}`}
                style={{
                  backgroundImage: `url(${idcardIcon})`,
                  ...iconPorps,
                  width: '21px',
                  height: '27px',
                }}
              />
            </InputItem>
          </section>
          <section className={styles.fileid}>
            <Button className="button-ok" onClick={onOk}>
              提交
            </Button>
          </section>
        </div>
      );
    }
  }
);

// eslint-disable-next-line react/no-multi-comp
@connect()
class BindPhone extends PureComponent {
  state = {
    current: 0,
  };

  handleSubmitStep0 = (toNext = false) => {
    let success = false;
    let formValues = null;

    this[STEP_0_FORM_REF].props.form.validateFields((error, values) => {
      if (error) {
        const errKeys = Object.keys(error);
        showError(error[errKeys[0]].errors[0].message);
        return;
      }
      success = true;
      formValues = values;
    });

    if (!success) {
      return false;
    }
    // 校验成功，并且运行下一步
    if (success && toNext) {
      this.setState(({ current }) => ({
        current: current + 1,
      }));
    }

    return formValues;
  };

  handleRefForm = (ref, refKey) => {
    this[refKey] = ref;
  };

  render() {
    const { current } = this.state;
    return (
      <DocumentTitle title="注册会员">
        <Fragment>
          <Steps current={current} direction="horizontal">
            {steps.map(s => (
              <Steps.Step
                onClick={() => this.setState({ current: s.key })}
                key={s.key}
                title={s.title}
              />
            ))}
          </Steps>
          <WhiteSpace size="lg" />
          <section style={{ display: `${current === 0 ? '' : 'none'}` }}>
            <Step0Form
              wrappedComponentRef={ref => this.handleRefForm(ref, STEP_0_FORM_REF)}
              onOk={() => this.handleSubmitStep0(true)}
            />
          </section>
          <section style={{ display: `${current === 1 ? '' : 'none'}` }}>
            <Step1Form
              wrappedComponentRef={ref => this.handleRefForm(ref, STEP_1_FORM_REF)}
              onOk={() => this.handleSubmitStep3(true)}
            />
          </section>
          <section style={{ display: `${current === 2 ? '' : 'none'}` }}>
            <Step2Form
              wrappedComponentRef={ref => this.handleRefForm(ref, STEP_2_FORM_REF)}
              onOk={() => this.handleSubmitStep2(true)}
            />
          </section>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default BindPhone;
