/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-stateless-function */
import React, { PureComponent, Fragment } from 'react';
import { InputItem, Button, List, Steps, WhiteSpace, DatePicker, Toast, Modal } from 'antd-mobile';
import { Upload, Spin } from 'antd';
import router from 'umi/router';
import { phoneReg, showError } from '@/utils/utils';
import { createForm } from 'rc-form';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { MOCK_API_PREFIX } from '@/common/app';
import UploadLoading from './UploadLoading';

import styles from './style.less';

import userIcon from './icons/icon_user@2x.png';
import idcardIcon from './icons/icon_idcard@2x.png';
import phoneIcon from './icons/icon_phone@2x.png';

// 边框背景图
import uploadBgImage from './icons/upload_bg@2x.png';
// 身份证示例
import idcardDemo1Image from './icons/idcard_demo_1@2x.png';
import idcardDemo2Image from './icons/idcard_demo_2@2x.png';

// 行驶证
import carLicenseDemoImage from './icons/car_license_demo@2x.png';
// 驾驶证
import driverLicenseDemoImage from './icons/driver_license_demo@2x.png';
// 车辆照片示例
import carDemoImage from './icons/car_demo@2x.png';

// 上传按钮
import uploadImage from './icons/icon_upload@2x.png';

/**
 * 上传图片是校验大小
 * @param {} file
 */
export function beforeUpload(file) {
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    Modal.alert('上传的图片不能超过5M', '', [{ text: '好的', onPress: () => {} }]);
  }
  return isLt5M;
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

const STEP_0_FORM_REF = 'step_0_form';
const STEP_1_FORM_REF = 'step_1_form';
const STEP_2_FORM_REF = 'step_2_form';

const UserInfoForm = createForm()(
  class FormWrapper extends React.Component {
    handleOk = () => {
      const { form, onSubmit } = this.props;
      form.validateFields((error, values) => {
        if (error) {
          onSubmit();
          const errKeys = Object.keys(error);
          showError(error[errKeys[0]].errors[0].message);
          return;
        }
        onSubmit(values);
      });
    };

    render() {
      const { form } = this.props;
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
            <Button className="button-ok" onClick={this.handleOk}>
              下一步
            </Button>
          </section>
        </div>
      );
    }
  }
);

const IdcardForm = createForm()(
  class FormWrapper extends React.Component {
    state = {
      //
      idardImage1Loading: true,
      idardImage1: [],

      idardImage2Loading: false,
      idardImage2: [],
    };

    handleOk = () => {
      const { form, onSubmit } = this.props;
      form.validateFields((error, values) => {
        if (error) {
          onSubmit();
          const errKeys = Object.keys(error);
          showError(error[errKeys[0]].errors[0].message);
          return;
        }

        const { idardImage1, idardImage2 } = values;

        onSubmit({
          idardImage1: getUploadImageUrl(idardImage1),
          idardImage2: getUploadImageUrl(idardImage2),
        });
      });
    };

    uploadIdcardImage1 = info => {
      if (info.file.status === 'uploading') {
        this.setState({ idardImage1Loading: true });
        return;
      }

      if (info.file.status === 'done') {
        const result = info.fileList.map(file => ({
          uid: file.uid,
          url: file.response ? file.response.url : file.url,
        }));

        this.setState({
          idardImage1: result,
          idardImage1Loading: false,
        });
      }
    };

    uploadIdcardImage2 = info => {
      if (info.file.status === 'uploading') {
        this.setState({ idardImage2Loading: true });
        return;
      }

      if (info.file.status === 'done') {
        const result = info.fileList.map(file => ({
          uid: file.uid,
          url: file.response ? file.response.url : file.url,
        }));

        this.setState({
          idardImage2: result,
          idardImage2Loading: false,
        });
      }
    };

    render() {
      const { idardImage1, idardImage1Loading, idardImage2, idardImage2Loading } = this.state;
      const {
        form: { getFieldDecorator },
      } = this.props;
      return (
        <div className={styles.formWrap}>
          <section className={styles.fileid}>
            <p className={styles.uploadText}>上传身份证人像面</p>
            {getFieldDecorator('idardImage1', {
              initialValue: idardImage1,
              rules: [
                {
                  required: true,
                  message: '请上传身份证人像面',
                },
              ],
            })(
              <Upload
                className={styles.uploadRc}
                showUploadList={false}
                action={`${IS_DEV ? MOCK_API_PREFIX : ''}/api/upload`}
                onChange={this.uploadIdcardImage1}
                beforeUpload={beforeUpload}
                name="file"
              >
                <div
                  className={styles.uploadWrap}
                  style={{ backgroundImage: `url(${uploadBgImage})` }}
                >
                  <img
                    className={styles.demo}
                    src={idardImage1.length === 0 ? idcardDemo1Image : idardImage1[0].url}
                    alt="身份证人像面"
                  />
                  <img className={styles.uploadIcon} src={uploadImage} alt="上传" />
                  {idardImage1Loading && <UploadLoading />}
                </div>
              </Upload>
            )}
          </section>
          <section className={styles.fileid}>
            <p className={styles.uploadText}>上传身份证国徽面</p>
            <div className={styles.uploadWrap} style={{ backgroundImage: `url(${uploadBgImage})` }}>
              {getFieldDecorator('idardImage2', {
                initialValue: idardImage2,
                rules: [
                  {
                    required: true,
                    message: '请上传身份证国徽面',
                  },
                ],
              })(
                <Upload
                  className={styles.uploadRc}
                  showUploadList={false}
                  action={`${IS_DEV ? MOCK_API_PREFIX : ''}/api/upload`}
                  onChange={this.uploadIdcardImage2}
                  beforeUpload={beforeUpload}
                  name="file"
                >
                  <div
                    className={styles.uploadWrap}
                    style={{ backgroundImage: `url(${uploadBgImage})` }}
                  >
                    <img
                      className={styles.demo}
                      src={idardImage2.length === 0 ? idcardDemo2Image : idardImage2[0].url}
                      alt="请上传身份证国徽面"
                    />
                    <img className={styles.uploadIcon} src={uploadImage} alt="上传" />
                    {idardImage2Loading && <UploadLoading />}
                  </div>
                </Upload>
              )}
            </div>
          </section>
          <section className={styles.fileid}>
            <Button className="button-ok" onClick={this.handleOk}>
              下一步
            </Button>
          </section>
        </div>
      );
    }
  }
);

const CarForm = createForm()(
  class FormWrapper extends React.Component {
    state = {};

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
            />
          </section>
          <section className={styles.fileid}>
            <InputItem
              placeholder="请输入行驶证号"
              className="carcode"
              {...getFieldProps('phone', {
                validateFirst: true,
                rules: [{ required: true, whitespace: true, message: '请输入行驶证号' }],
              })}
            />
          </section>
          <section className={styles.fileid}>
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
          <section className={styles.fileid}>
            <p className={styles.uploadText}>上传行驶证照片</p>
            <div className={styles.uploadWrap} style={{ backgroundImage: `url(${uploadBgImage})` }}>
              <img className={styles.demo} src={carLicenseDemoImage} alt="上传行驶证照片" />
              <img className={styles.uploadIcon} src={uploadImage} alt="上传" />
            </div>
          </section>
          <section className={styles.fileid}>
            <p className={styles.uploadText}>上传驾驶证照片</p>
            <div className={styles.uploadWrap} style={{ backgroundImage: `url(${uploadBgImage})` }}>
              <img className={styles.demo} src={driverLicenseDemoImage} alt="上传驾驶证照片" />
              <img className={styles.uploadIcon} src={uploadImage} alt="上传" />
            </div>
          </section>
          <section className={styles.fileid}>
            <p className={styles.uploadText}>上传车辆照片</p>
            <div className={styles.uploadWrap} style={{ backgroundImage: `url(${uploadBgImage})` }}>
              <img className={styles.demo} src={carDemoImage} alt="上传车辆照片" />
              <img className={styles.uploadIcon} src={uploadImage} alt="上传" />
            </div>
          </section>
          <section className={styles.fileid}>
            <Button className="button-ok" onClick={onOk}>
              保存
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

    userInfo: undefined,
    idcardInfo: undefined,
    cartInfo: undefined,
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
      // 提示确认提交吗？
      Modal.alert('确定保存吗？', '', [
        { text: '取消', onPress: () => {}, style: 'default' },
        {
          text: '保存',
          onPress: () => {
            // TODO AJAX
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
            <UserInfoForm
              wrappedComponentRef={ref => this.handleRefForm(ref, STEP_0_FORM_REF)}
              onSubmit={this.handleSubmitUserInfo}
            />
          </section>
          <section style={{ display: `${current === 1 ? '' : 'none'}` }}>
            <IdcardForm
              wrappedComponentRef={ref => this.handleRefForm(ref, STEP_1_FORM_REF)}
              onSubmit={this.handleSubmitIdcard}
            />
          </section>
          <section style={{ display: `${current === 2 ? '' : 'none'}` }}>
            <CarForm
              wrappedComponentRef={ref => this.handleRefForm(ref, STEP_2_FORM_REF)}
              onSubmit={this.handleSubmitCarInfo}
            />
          </section>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default BindPhone;
