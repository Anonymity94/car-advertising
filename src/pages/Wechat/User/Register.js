/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-stateless-function */
import React, { PureComponent, Fragment } from 'react';
import { InputItem, Button, List, Steps, WhiteSpace, DatePicker, Modal, Flex } from 'antd-mobile';
import { Upload } from 'antd';
import { phoneReg, showError } from '@/utils/utils';
import { createForm } from 'rc-form';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { MOCK_API_PREFIX } from '@/common/app';
import moment from 'moment';
import UploadLoading from './UploadLoading';

import styles from './style.less';

import userIcon from './icons/icon_user@2x.png';
import idcardIcon from './icons/icon_idcard@2x.png';
import phoneIcon from './icons/icon_phone@2x.png';
import captchaIcon from './icons/icon_captcha@2x.png';

// 边框背景图
import uploadBgImage from './icons/upload_bg@2x.png';
// 身份证示例
import idcardBackDemo from './icons/idcard_back_demo@2x.png';
import idcardFrontDemo from './icons/idcard_front_demo@2x.png';

// 行驶证
import carCodeDemo from './icons/car_license_demo@2x.png';
// 驾驶证
import driverLicenseDemo from './icons/driver_license_demo@2x.png';
// 车辆照片示例
import carDemo from './icons/car_demo@2x.png';

// 上传按钮
import uploadIcon from './icons/icon_upload@2x.png';

/**
 * 上传图片是校验大小
 * @param {} file
 */
export function beforeUpload(file) {
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    Modal.alert('上传的图片不能超过5M', '', [{ text: '知道了', onPress: () => {} }]);
  }
  return isLt5M;
}

/**
 * 上传图片
 * @param {*} info 图片对象
 * @param {*} state 对应的 state 值
 * @param {*} loading loading
 */
export function handleUpload(info, state, loading) {
  const { onUpload } = this.props;
  const { status } = info.file;

  if (status === 'uploading') {
    this.setState({ [loading]: true });
    return;
  }

  if (status === 'done') {
    const result = info.fileList.map(file => ({
      uid: file.uid,
      url: file.response ? file.response.url : file.url,
    }));

    const newImage = result.pop();

    // 上传成功后，把新的 url 传递出去，用于用户在个人中心页修改
    if (onUpload) {
      onUpload({
        [state]: newImage.url,
      });
    }

    this.setState({
      // 只取最后 一个
      [state]: [newImage],
      [loading]: false,
    });
  }

  if (status === 'error') {
    Modal.alert('上传失败', '', [{ text: '知道了', onPress: () => {} }]);
    this.setState({
      [state]: [],
      [loading]: false,
    });
  }
}

export function renderUploadHtml(item) {
  // value
  const value = this.state[item.field];
  // loading
  const loading = this.state[item.loading];

  const {
    form: { getFieldDecorator },
    // eslint-disable-next-line react/no-this-in-sfc
  } = this.props;
  return (
    <section className={styles.field}>
      <p className={styles.uploadText}>{item.placeholder}</p>
      {getFieldDecorator(item.field, {
        initialValue: value,
        rules: [
          {
            required: true,
            message: item.placeholder,
          },
        ],
      })(
        <Upload
          className={styles.uploadRc}
          showUploadList={false}
          withCredentials
          action={`${IS_DEV ? MOCK_API_PREFIX : ''}/api/upload`}
          // eslint-disable-next-line react/no-this-in-sfc
          onChange={info => this.handleUpload(info, item.field, item.loading)}
          beforeUpload={beforeUpload}
          accept="image/*"
          name="file"
        >
          <div className={styles.uploadWrap} style={{ backgroundImage: `url(${uploadBgImage})` }}>
            <img
              className={styles.demo}
              src={value.length === 0 ? item.demoImage : value[0].url}
              alt={item.placeholder}
            />
            <img className={styles.uploadIcon} src={uploadIcon} alt="上传" />
            {loading && <UploadLoading />}
          </div>
        </Upload>
      )}
    </section>
  );
}

/**
 * 从已上传的图片中获取图片的url值
 * @param {} file
 */
const getUploadImageUrl = data => {
  let images = [];

  if (Array.isArray(data)) {
    images = data.map(item => item.url);
  }
  if (data && data.fileList) {
    images = data.fileList.map(file => (file.response ? file.response.url : file.url));
  }
  return images.join(',');
};

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

export const UserInfoForm = createForm()(
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

    handleOk = () => {
      const { form, onSubmit } = this.props;
      form.validateFields((error, values) => {
        if (error) {
          if (onSubmit) onSubmit();
          const errKeys = Object.keys(error);
          showError(error[errKeys[0]].errors[0].message);
          return;
        }
        if (onSubmit) onSubmit(values);
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
          <section className={styles.field}>
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
          <section className={styles.field}>
            <Button className="button-ok" onClick={this.handleOk}>
              下一步
            </Button>
          </section>
        </div>
      );
    }
  }
);

export const IdcardForm = createForm()(
  class FormWrapper extends React.Component {
    constructor(props) {
      super(props);

      const { idcardBackImage, idcardFrontImage } = this.props;

      this.state = {
        // 反面，人像面
        idcardBackImageLoading: false,
        idcardBackImage: idcardBackImage ? [{ url: idcardBackImage }] : [],

        // 正面，国徽面
        idcardFrontImageLoading: false,
        idcardFrontImage: idcardFrontImage ? [{ url: idcardFrontImage }] : [],
      };

      this.renderUploadHtml = renderUploadHtml.bind(this);
      this.handleUpload = handleUpload.bind(this);
    }

    handleOk = () => {
      const { form, onSubmit } = this.props;
      form.validateFields((error, values) => {
        if (error) {
          if (onSubmit) onSubmit();
          const errKeys = Object.keys(error);
          showError(error[errKeys[0]].errors[0].message);
          return;
        }

        const { idcardBackImage, idcardFrontImage } = values;

        if (onSubmit) {
          onSubmit({
            idcardBackImage: getUploadImageUrl(idcardBackImage),
            idcardFrontImage: getUploadImageUrl(idcardFrontImage),
          });
        }
      });
    };

    render() {
      const { showbtn = true } = this.props;
      const renderUpload = [
        {
          field: 'idcardBackImage', // 表单的值
          loading: 'idcardBackImageLoading',
          demoImage: idcardBackDemo,
          placeholder: '上传身份证人像面',
        },
        {
          field: 'idcardFrontImage',
          loading: 'idcardFrontImageLoading',
          demoImage: idcardFrontDemo,
          placeholder: '上传身份证国徽面',
        },
      ].map(item => this.renderUploadHtml(item));

      return (
        <div className={styles.formWrap}>
          {renderUpload}
          {showbtn && (
            <section className={styles.field}>
              <Button className="button-ok" onClick={this.handleOk}>
                下一步
              </Button>
            </section>
          )}
        </div>
      );
    }
  }
);

export const CarForm = createForm()(
  class FormWrapper extends React.Component {
    constructor(props) {
      super(props);
      const { carCodeImage, driverLicenseImage, carImage } = this.props;
      this.state = {
        // 行驶证照片
        carCodeLoading: false,
        carCodeImage: carCodeImage ? [{ url: carCodeImage }] : [],

        // 驾驶证照片
        driverLicenseLoading: false,
        driverLicenseImage: driverLicenseImage ? [{ url: driverLicenseImage }] : [],

        // 车辆照片
        carImageLoading: false,
        carImage: carImage ? [{ url: carImage }] : [],
      };

      this.renderUploadHtml = renderUploadHtml.bind(this);
      this.handleUpload = handleUpload.bind(this);
    }

    handleOk = () => {
      const { form, onSubmit } = this.props;
      form.validateFields((error, values) => {
        if (error) {
          if (onSubmit) onSubmit();
          const errKeys = Object.keys(error);
          showError(error[errKeys[0]].errors[0].message);
          return;
        }

        const { carCodeImage, driverLicenseImage, carImage, expireTime } = values;

        if (onSubmit) {
          onSubmit({
            ...values,
            expireTime: moment(expireTime).format('YYYY-MM-DD'),
            carCodeImage: getUploadImageUrl(carCodeImage),
            driverLicenseImage: getUploadImageUrl(driverLicenseImage),
            carImage: getUploadImageUrl(carImage),
          });
        }
      });
    };

    render() {
      const { form, showinfo = true, showbtn = true } = this.props;
      const { getFieldProps } = form;

      const renderUpload = [
        {
          field: 'carCodeImage',
          loading: 'carCodeLoading',
          demoImage: carCodeDemo,
          placeholder: '上传行驶证照片',
        },
        {
          field: 'driverLicenseImage',
          loading: 'driverLicenseLoading',
          demoImage: driverLicenseDemo,
          placeholder: '上传驾驶证照片',
        },
        {
          field: 'carImage',
          loading: 'carImageLoading',
          demoImage: carDemo,
          placeholder: '上传车辆照片',
        },
      ].map(item => this.renderUploadHtml(item));

      return (
        <div className={styles.formWrap}>
          {/* 是否显示基本信息 */}
          {showinfo && (
            <Fragment>
              <section className={styles.field}>
                <InputItem
                  placeholder="请输入车辆类型"
                  className="required"
                  {...getFieldProps('carType', {
                    validateFirst: true,
                    rules: [{ required: true, whitespace: true, message: '请输入车辆类型' }],
                  })}
                />
              </section>
              <section className={styles.field}>
                <InputItem
                  placeholder="请输入行驶证号"
                  className="required"
                  {...getFieldProps('carCode', {
                    validateFirst: true,
                    rules: [{ required: true, whitespace: true, message: '请输入行驶证号' }],
                  })}
                />
              </section>
              <section className={styles.field}>
                <DatePicker
                  className="required"
                  mode="date"
                  {...getFieldProps('expireTime', {
                    rules: [{ required: true, message: '请选择证件到期时间' }],
                  })}
                >
                  <List.Item>
                    <span className={styles.subText}>请选择行驶证到期时间</span>
                  </List.Item>
                </DatePicker>
              </section>
            </Fragment>
          )}

          {renderUpload}

          {showbtn && (
            <section className={styles.field}>
              <Button className="button-ok" onClick={this.handleOk}>
                保存
              </Button>
            </section>
          )}
        </div>
      );
    }
  }
);

// eslint-disable-next-line react/no-multi-comp
@connect(({ loading }) => ({
  submitLoading: loading.effects['driverModel/register'],
}))
class BindPhone extends PureComponent {
  state = {
    current: 0,
    userInfo: undefined,
    idcardInfo: undefined,
  };

  handleSubmitUserInfo = values => {
    if (values) {
      this.setState(({ current }) => ({
        current: current + 1,
      }));
    }
    this.setState({ userInfo: values });
  };

  handleSubmitIdcard = values => {
    if (values) {
      this.setState(({ current }) => ({
        current: current + 1,
      }));
    }
    this.setState({ idcardInfo: values });
  };

  handleSubmitCarInfo = values => {
    if (values) {
      const { userInfo, idcardInfo } = this.state;
      // 检查用户信息身份验证信息
      if (!userInfo) {
        Modal.alert('无法保存', '请检查个人资料', [
          {
            text: '好的',
            onPress: () => {
              this.setState({
                current: 0,
              });
            },
          },
        ]);
        return;
      }
      if (!idcardInfo) {
        Modal.alert('无法保存', '请检查身份验证', [
          {
            text: '好的',
            onPress: () => {
              this.setState({
                current: 1,
              });
            },
          },
        ]);
      }

      const { dispatch } = this.props;

      // 提示确认提交吗？
      Modal.alert('确定保存吗？', '', [
        { text: '取消', onPress: () => {}, style: 'default' },
        {
          text: '保存',
          onPress: () => {
            dispatch({
              type: 'driverModel/register',
              payload: {
                ...userInfo,
                ...idcardInfo,
                ...values,
              },
            });
          },
        },
      ]);
    }
  };

  handleRefForm = (ref, refKey) => {
    this[refKey] = ref;
  };

  render() {
    const { current } = this.state;
    const { dispatch } = this.props;

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
            <UserInfoForm dispatch={dispatch} onSubmit={this.handleSubmitUserInfo} />
          </section>
          <section style={{ display: `${current === 1 ? '' : 'none'}` }}>
            <IdcardForm onSubmit={this.handleSubmitIdcard} />
          </section>
          <section style={{ display: `${current === 2 ? '' : 'none'}` }}>
            <CarForm onSubmit={this.handleSubmitCarInfo} />
          </section>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default BindPhone;
