/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-stateless-function */
import React, { PureComponent, Fragment, memo } from 'react';
import {
  InputItem,
  Button,
  List,
  Steps,
  WhiteSpace,
  DatePicker,
  Modal,
  Flex,
  NoticeBar,
  ImagePicker,
  Toast,
} from 'antd-mobile';
import request from '@/utils/request';
import Prompt from 'umi/prompt';
import { Upload, Input } from 'antd';
import { phoneReg, showError } from '@/utils/utils';
import storage from '@/utils/storage';
import { createForm } from 'rc-form';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import _ from 'lodash';
import { MOCK_API_PREFIX } from '@/common/app';
import moment from 'moment';
import router from 'umi/router';
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
import Loading from '@/components/Loading';
import {
  AUDIT_STATE_PASSED,
  AUDIT_STATE_UNREVIEWED,
  AUDIT_STATE_NO_REGISTER,
  AUDIT_STATE_REFUSE,
} from '@/common/constants';

/**
 * 上传图片
 * @param {*} info 图片对象
 * @param {*} state 对应的 state 值
 * @param {*} loading loading
 */
export function handleUpload(files, type, state, loading) {
  const { onUpload, dispatch, form } = this.props;
  if (type === 'add') {
    const { file } = files[files.length - 1];

    const isLt5M = file.size / 1000 / 1000 < 5;
    if (!isLt5M) {
      Modal.alert('上传的图片不能超过5M', '', [{ text: '知道了', onPress: () => {} }]);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.setState({ [loading]: true });
    dispatch({
      type: 'global/upload',
      payload: formData,
    }).then(({ success, result }) => {
      if (success) {
        Toast.loading('上传成功，加载中...', 0);
        const imageUrl = result.url;
        // 刷新form内容值
        form.setFieldsValue({
          [state]: imageUrl,
        });
        // 填充state
        this.setState(
          {
            [state]: imageUrl,
            [loading]: false,
          },
          () => {
            Toast.hide();
          }
        );
        // 上传成功后，把新的 url 传递出去，用于用户在个人中心页修改
        if (onUpload) {
          onUpload({
            [state]: imageUrl,
          });
        }
      } else {
        Modal.alert('上传失败', '', [{ text: '知道了', onPress: () => {} }]);
        this.setState({
          // [state]: [],
          [loading]: false,
        });
      }
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
      <div style={{ display: 'none' }}>
        {getFieldDecorator(item.field, {
          initialValue: value,
          rules: [
            {
              required: true,
              message: item.placeholder,
            },
          ],
        })(<Input />)}
      </div>
      <div className={styles.imagePickerWrap}>
        <div className={styles.uploadWrap} style={{ backgroundImage: `url(${uploadBgImage})` }}>
          <img
            className={styles.demo}
            src={value.length === 0 ? item.demoImage : value}
            alt={item.placeholder}
          />
          <img className={styles.uploadIcon} src={uploadIcon} alt="上传" />
          {loading && <UploadLoading />}
          {!loading && (
            <ImagePicker
              length="1"
              onChange={(files, type) => this.handleUpload(files, type, item.field, item.loading)}
              onImageClick={(index, fs) => console.log(index, fs)}
              selectable={value.length < 2}
              accept="image/*"
              multiple={false}
            />
          )}
        </div>
      </div>
    </section>
  );
}

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

const LOCAL_USER_INFO = 'local_user_info';
const LOCAL_IDCARD_INFO = 'local_idcard_info';
const LOCAL_CAR_INFO = 'local_car_info';

/**
 * 循环保存临时数据到本地浏览器
 * @param {String} key key
 * @param {Object} form
 * @param {Object} oldValue 老数据
 */
const saveValueToStorage = (key, form, oldValue) => {
  form.validateFields((error, values) => {
    storage.put(key, JSON.stringify({ ...oldValue, ...values }));
  });
};

export const UserInfoForm = createForm()(
  class FormWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        count: 0,
        phoneCaptcha: '',

        historyValue: {},
      };
    }

    componentDidMount() {
      // 只有在注册页面才开始循环保存
      const { pathname } = window.location;
      const localValue = storage.get(LOCAL_USER_INFO);
      const historyValue = localValue ? JSON.parse(localValue) : {};
      const isRegisterPage = pathname === '/h5/user/register';
      this.setState({
        historyValue,
      });

      if (isRegisterPage) {
        setTimeout(() => {
          const { form } = this.props;
          this.saveToStorageLooper = setInterval(() => {
            saveValueToStorage(LOCAL_USER_INFO, form, historyValue);
          }, 2000);
        }, 0);
      }
    }

    componentWillUnmount() {
      if (this.interval) {
        clearInterval(this.interval);
      }
      if (this.saveToStorageLooper) {
        clearInterval(this.saveToStorageLooper);
      }
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
      }).then(({ success, captcha }) => {
        if (success) {
          this.runGetCaptchaCountDown();
        }
        this.setState({
          phoneCaptcha: captcha,
        });
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
      const { count, historyValue } = this.state;
      const { form, phone } = this.props;
      const { getFieldProps } = form;
      return (
        <div className={styles.formWrap}>
          <section className={styles.field}>
            <InputItem
              placeholder="请输入您的姓名（不可修改）"
              className="required"
              {...getFieldProps('username', {
                initialValue: historyValue.username || '',
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
                initialValue: phone || historyValue.phone || '',
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
                initialValue: historyValue.idcard || '',
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
      const { pathname } = window.location;
      const isRegisterPage = pathname === '/h5/user/register';

      const localValue = storage.get(LOCAL_IDCARD_INFO);
      const historyValue = localValue ? JSON.parse(localValue) : {};

      const { idcardBackImage, idcardFrontImage } = this.props;

      this.state = {
        // 反面，人像面
        idcardBackImageLoading: false,
        idcardBackImage: isRegisterPage
          ? historyValue.idcardBackImage || ''
          : idcardBackImage || '',

        // 正面，国徽面
        idcardFrontImageLoading: false,
        idcardFrontImage: isRegisterPage
          ? historyValue.idcardFrontImage || ''
          : idcardFrontImage || '',

        historyValue,
        isRegisterPage,
      };

      this.renderUploadHtml = renderUploadHtml.bind(this);
      this.handleUpload = handleUpload.bind(this);
    }

    componentDidMount() {
      // 只有在注册页面才开始循环保存
      const { isRegisterPage, historyValue } = this.state;
      if (isRegisterPage) {
        setTimeout(() => {
          const { form } = this.props;
          this.saveToStorageLooper = setInterval(() => {
            saveValueToStorage(LOCAL_IDCARD_INFO, form, historyValue);
          }, 2000);
        }, 0);
      }
    }

    componentWillUnmount() {
      if (this.saveToStorageLooper) {
        clearInterval(this.saveToStorageLooper);
      }
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

        if (onSubmit) {
          onSubmit({
            ...values,
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
      const { pathname } = window.location;
      const isRegisterPage = pathname === '/h5/user/register';

      const localValue = storage.get(LOCAL_CAR_INFO);
      const historyValue = localValue ? JSON.parse(localValue) : {};

      const { carCodeImage, driverLicenseImage, carImage } = this.props;
      this.state = {
        isRegisterPage,
        historyValue,

        // 行驶证照片
        carCodeLoading: false,
        carCodeImage: isRegisterPage ? historyValue.carCodeImage || '' : carCodeImage || '',

        // 驾驶证照片
        driverLicenseLoading: false,
        driverLicenseImage: isRegisterPage
          ? historyValue.driverLicenseImage || ''
          : driverLicenseImage || '',

        // 车辆照片
        carImageLoading: false,
        carImage: isRegisterPage ? historyValue.carImage || '' : carImage || '',
      };

      this.renderUploadHtml = renderUploadHtml.bind(this);
      this.handleUpload = handleUpload.bind(this);
    }

    componentDidMount() {
      // 只有在注册页面才开始循环保存
      const { isRegisterPage, historyValue } = this.state;
      if (isRegisterPage) {
        setTimeout(() => {
          const { form } = this.props;
          this.saveToStorageLooper = setInterval(() => {
            saveValueToStorage(LOCAL_CAR_INFO, form, historyValue);
          }, 2000);
        }, 0);
      }
    }

    componentWillUnmount() {
      if (this.saveToStorageLooper) {
        clearInterval(this.saveToStorageLooper);
      }
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
          });
        }
      });
    };

    render() {
      const { form, showinfo = true, showbtn = true } = this.props;
      const { getFieldProps } = form;
      const { historyValue } = this.state;

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
                    initialValue: historyValue.carType || '',
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
                    initialValue: historyValue.carCode || '',
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

const CustomModal = memo(({ title, desc, okText, onOk }) => (
  <div className="am-modal-wrap " role="dialog" aria-labelledby="Delete">
    <div role="document" className="am-modal am-modal-transparent">
      <div className="am-modal-content">
        <div className="am-modal-header">
          <div className="am-modal-title">{title}</div>
        </div>
        <div className="am-modal-body">
          <div className="am-modal-alert-content">{desc}</div>
        </div>
        {okText && onOk && (
          <div className="am-modal-footer">
            <div className="am-modal-button-group-v am-modal-button-group-normal" role="group">
              <a className="am-modal-button" role="button" onClick={() => (onOk ? onOk() : null)}>
                {okText}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
));

// eslint-disable-next-line react/no-multi-comp
@connect(({ driverModel: { detail: driverDetail }, loading }) => ({
  driverDetail,
  submitLoading: loading.effects['driverModel/register'],
  detailLoading:
    loading.effects['driverModel/queryDriverDetail'] || loading.effects['login/queryWechatUser'],
}))
class Register extends PureComponent {
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

  // 没有登录也允许注册
  handleSubmitCarInfo = values => {
    const { driverDetail } = this.props;
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
        return;
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
                id: driverDetail.id,
                ...userInfo,
                ...idcardInfo,
                ...values,
                status: 0, // 注册就是其实修改信息，把状态修改成未审核的状态
              },
            }).then(success => {
              if (success) {
                // 注册成功了，清除所有的key
                storage.remove(LOCAL_USER_INFO);
                storage.remove(LOCAL_IDCARD_INFO);
                storage.remove(LOCAL_CAR_INFO);
              }
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
    const { dispatch, driverDetail, detailLoading } = this.props;

    if (detailLoading) {
      return <Loading />;
    }

    return (
      <DocumentTitle title="注册会员">
        <Fragment>
          <div
            className={
              !driverDetail.id ||
              (driverDetail.id &&
                (driverDetail.status === AUDIT_STATE_NO_REGISTER ||
                  driverDetail.status === AUDIT_STATE_REFUSE))
                ? ''
                : 'am-modal-mask'
            }
          />
          {driverDetail.status === AUDIT_STATE_PASSED && (
            <CustomModal title="无法注册" desc="注册会员已通过，无需再次注册" />
          )}
          {driverDetail.status === AUDIT_STATE_UNREVIEWED && (
            <CustomModal title="无法注册" desc="会员信息审核中，无需再次注册" />
          )}
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
            <UserInfoForm
              phone={driverDetail.phone}
              dispatch={dispatch}
              onSubmit={this.handleSubmitUserInfo}
            />
          </section>
          <section style={{ display: `${current === 1 ? '' : 'none'}` }}>
            <IdcardForm dispatch={dispatch} onSubmit={this.handleSubmitIdcard} />
          </section>
          <section style={{ display: `${current === 2 ? '' : 'none'}` }}>
            <CarForm dispatch={dispatch} onSubmit={this.handleSubmitCarInfo} />
          </section>
          <Prompt
            when
            message={location => window.confirm(`confirm to leave to ${location.pathname}?`)}
          />
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default Register;
