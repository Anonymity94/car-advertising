import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { TextareaItem, InputItem, Button, Toast, Flex, Modal, Picker, List } from 'antd-mobile';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import {
  PUBLISH_STATE_YES,
  AUDIT_STATE_REFUSE,
  AUDIT_STATE_UNREVIEWED,
  AUDIT_STATE_PASSED,
  AUDIT_STATE_NO_REGISTER,
  GOOD_EXCHANGE_TYPE_LIST,
  GOOD_EXCHANGE_TYPE_SELF_MAIL,
} from '@/common/constants';
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import { Popup } from 'react-weui';
import { createForm } from 'rc-form';
import { showError, phoneReg } from '@/utils/utils';

import router from 'umi/router';
import styles from '../article.less';
import formStyle from '../User/style.less';

@connect()
class FormContent extends React.Component {
  submit = () => {
    const { form, onOk } = this.props;
    form.validateFields((error, values) => {
      if (error) {
        const errKeys = Object.keys(error);
        showError(error[errKeys[0]].errors[0].message);
        return;
      }

      onOk({ ...values, exchangeType: values.exchangeType.join('') });
    });
  };

  render() {
    const {
      form,
      form: { getFieldValue },
      onCancle,
    } = this.props;
    const { getFieldProps } = form;
    return (
      <div className={[formStyle.formWrap, formStyle.normalLabel].join(' ')}>
        <section className={formStyle.field}>
          <InputItem
            placeholder="请输入兑换数量"
            className="required"
            {...getFieldProps('count', {
              normalize: v => {
                if (v && (v.charAt(0) === '0' || v.indexOf('.') >= 0)) {
                  return v.replace(/^0*(\d*).*$/, '$1');
                }
                return v;
              },
              validateFirst: true,
              rules: [{ required: true, whitespace: true, message: '请输入兑换数量' }],
              // TODO: 判断选择的数量所需的乐蚁果，和自己拥有的乐蚁果的数量
            })}
          >
            兑换数量
          </InputItem>
        </section>
        <section className={formStyle.field}>
          <Picker
            data={GOOD_EXCHANGE_TYPE_LIST}
            cols={1}
            {...getFieldProps('exchangeType', {
              validateFirst: true,
              rules: [{ required: true, message: '请选择兑换方式' }],
            })}
            className="required"
          >
            <List.Item arrow="horizontal">兑换方式</List.Item>
          </Picker>
        </section>
        {getFieldValue('exchangeType') &&
          +getFieldValue('exchangeType').join('') === GOOD_EXCHANGE_TYPE_SELF_MAIL && (
            <Fragment>
              <section className={formStyle.field}>
                <InputItem
                  placeholder="请输入收货人姓名"
                  className="required"
                  {...getFieldProps('recvName', {
                    validateFirst: true,
                    rules: [{ required: true, whitespace: true, message: '请输入收货人姓名' }],
                  })}
                >
                  收货人姓名
                </InputItem>
              </section>
              <section className={formStyle.field}>
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
                  手机号码
                </InputItem>
              </section>
              <section className={formStyle.field}>
                <p className={formStyle.title}>收货地址：</p>
                <TextareaItem
                  placeholder="详细地址：省、市、县区、街道、门牌号、小区、楼栋号、单元室等"
                  rows={4}
                  {...getFieldProps('address', {
                    rules: [{ required: false, whitespace: true, message: '请填写收货地址' }],
                  })}
                />
              </section>
            </Fragment>
          )}
        <section className={formStyle.field} style={{ padding: 20 }}>
          <Flex style={{ justifyContent: 'space-between' }}>
            <Button style={{ width: '45%' }} className="button-cancel" onClick={onCancle}>
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

const FormWrapper = createForm()(FormContent);

// eslint-disable-next-line react/no-multi-comp
@connect(({ goodsModel: { detail }, driverModel: { detail: userInfo }, loading }) => ({
  detail,
  userInfo,
  queryLoading: loading.effects['goodsModel/queryGoodsContent'],
}))
class Detail extends PureComponent {
  state = {
    exchangeModalOpen: false, // 兑换弹出框
    isExchanged: 'NAN', // 未检查状态, true 已兑换，false 未兑换
  };

  componentDidMount() {
    this.getContent();
    this.checkUserExchangeState();
  }

  checkUserExchangeState = () => {
    const {
      dispatch,
      match: { params },
      userInfo,
    } = this.props;

    if (!userInfo.id) return;

    dispatch({
      type: 'goodsModel/checkUserExchangeState',
      payload: {
        id: params.id,
      },
    }).then(({ success, result }) => {
      if (success) {
        this.setState({
          isExchanged: result,
        });
      } else {
        Toast.fail('检查兑换情况失败', 2);
      }
    });
  };

  getContent = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;

    dispatch({
      type: 'goodsModel/queryGoodsContent',
      payload: {
        id: params.id,
      },
    });
  };

  updateDriverIntegral = ({ id, restIntegral, usedIntegral }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/updateDriverIntegral',
      payload: {
        id,
        restIntegral,
        usedIntegral,
      },
    });
  };

  showReason = () => {
    const { userInfo } = this.props;
    if (!userInfo.id || userInfo.status === AUDIT_STATE_NO_REGISTER) {
      Modal.alert('无法兑换', '尚未注册会员', [
        { text: '知道了', onPress: () => {}, style: 'default' },
        { text: '立即注册', onPress: () => router.push('/h5/user/register'), style: 'default' },
      ]);
    }

    if (userInfo.id && userInfo.status === AUDIT_STATE_REFUSE) {
      Modal.alert('无法兑换', '注册申请未通过', [
        { text: '知道了', onPress: () => {}, style: 'default' },
        {
          text: '重新注册',
          onPress: () => router.push('/h5/user/register'),
          style: 'default',
        },
      ]);
    }
    if (userInfo.id && (userInfo.status === AUDIT_STATE_UNREVIEWED || !userInfo.status)) {
      Modal.alert('无法兑换', '注册信息审核中，审核通过后才可以兑换', [
        { text: '知道了', onPress: () => {}, style: 'default' },
      ]);
    }
  };

  handleCloseModal = () => {
    this.setState({
      exchangeModalOpen: false,
    });
  };

  handleSubmit = values => {
    // TODO: 判断提交
    console.log(values);
  };

  exchangeGood = () => {
    const { dispatch, detail, userInfo } = this.props;
    if (!detail.id) return;

    const { restIntegral = 0, usedIntegral = 0, id: userId } = userInfo;

    // 检查自己的乐蚁果是否足够兑换
    if (detail.integral > restIntegral) {
      Modal.alert('兑换失败', `乐蚁果不足：当前可用乐蚁果${restIntegral}`, [
        { text: '好的', onPress: () => {} },
      ]);
      return;
    }

    Modal.alert('确定兑换商品吗？', '', [
      { text: '取消', onPress: () => {}, style: 'default' },
      {
        text: '确定',
        onPress: () => {
          Toast.loading('提交中...', 0);
          dispatch({
            type: 'goodsModel/exchangeGood',
            payload: {
              id: detail.id, // 活动id
            },
          }).then(success => {
            Toast.hide();
            if (success) {
              this.setState({ isExchanged: true });
              // 去更新用户的乐蚁果情况
              this.updateDriverIntegral({
                id: userId,
                restIntegral: restIntegral - detail.integral,
                usedIntegral: usedIntegral + detail.integral,
              });

              Modal.alert('兑换成功', '请到取货地址及时取货', [
                {
                  text: '好的',
                  onPress: () => {
                    router.goBack();
                    // 重新获取用户信息，刷新乐蚁果情况
                    dispatch({
                      type: 'login/queryWechatUser',
                    });
                  },
                },
              ]);
            } else {
              Modal.alert('兑换失败', '', [{ text: '好的', onPress: () => {} }]);
            }
          });
        },
      },
    ]);
  };

  render() {
    const { isExchanged, exchangeModalOpen } = this.state;
    const { queryLoading, detail, userInfo } = this.props;

    if (queryLoading) {
      return <Loading />;
    }

    if (!detail.id) {
      return (
        <Fragment>
          <Empty text="商品不存在或已被删除" />
        </Fragment>
      );
    }

    if (detail.isPublish !== PUBLISH_STATE_YES) {
      return (
        <Fragment>
          <Empty text="商品已下线" />
        </Fragment>
      );
    }

    return (
      <DocumentTitle title="乐蚁果商品详情">
        <Fragment>
          <div className={`${styles.article} ${styles.goods}`}>
            {/* 标题 */}
            <div className={styles.header}>
              <img src={detail.image} alt={detail.name} />
              <div className={styles.info}>
                <div className={styles.left}>
                  <h2 className={styles.title}>
                    {detail.name}
                    <span>{detail.integral}乐蚁果</span>
                  </h2>
                  <p className={styles.businessName}>{detail.businessName}</p>
                </div>
                <div className={styles.right}>
                  {userInfo.id && userInfo.status === AUDIT_STATE_PASSED ? (
                    <span
                      className={isExchanged ? '' : styles.active}
                      onClick={() => (isExchanged === false ? this.exchangeGood() : {})}
                    >
                      {isExchanged === false ? '兑换' : '已兑换'}
                    </span>
                  ) : (
                    <span onClick={() => this.showReason()}>无法兑换</span>
                  )}
                </div>
              </div>
            </div>
            {/* 内容 */}
            <div className={styles.content}>
              {/* 活动内容 */}
              <p className={styles.divider}>取货地址</p>
              <div dangerouslySetInnerHTML={{ __html: `${detail.address}` }} />

              <p className={styles.divider}>商品内容</p>
              <div dangerouslySetInnerHTML={{ __html: `${detail.content}` }} />
            </div>

            {/* 兑换弹出框 */}
            <Popup
              className={styles.popupWrap}
              show={exchangeModalOpen}
              // 点击模态框不关闭
              onRequestClose={() => false}
            >
              {/* <PopupHeader
                left="修改地址"
                right={<span className={styles.popOk}>确认</span>}
                rightOnClick={() => {
                  this.setState({ exchangeModalOpen: false });
                  return false;
                }}
              /> */}
              <div>
                <FormWrapper onOk={this.handleSubmit} onCancle={this.handleCloseModal} />
              </div>
            </Popup>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default Detail;
