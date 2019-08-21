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
      userInfo = {},
      maxExchangeCount,
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
              rules: [
                { required: true, whitespace: true, message: '请输入兑换数量' },
                {
                  validator: (_, value, callback) => {
                    if (maxExchangeCount === 0) {
                      callback('积分不足,无法兑换');
                      return;
                    }
                    if (value <= 0) {
                      callback('最少兑换1个');
                      return;
                    }
                    if (value > maxExchangeCount) {
                      callback(`最多可兑换${maxExchangeCount}个`);
                      return;
                    }
                    callback();
                  },
                },
              ],
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
                    initialValue: userInfo.username,
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
                    initialValue: userInfo.phone,
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
  };

  componentDidMount() {
    this.getContent();
  }

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

  // 兑换失败时显示原因
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
    this.exchangeGood(values);
  };

  // 点击兑换按钮
  handleClickExchangeBtn = () => {
    const { detail, userInfo } = this.props;
    if (!detail.id) {
      Modal.alert('兑换失败', '无效的商品', [{ text: '好的', onPress: () => {} }]);
      return;
    }

    const { restIntegral = 0 } = userInfo;

    // 检查自己的乐蚁果是否足够至少兑换1个
    if (detail.integral > restIntegral) {
      Modal.alert('兑换失败', `乐蚁果不足：当前可用乐蚁果${restIntegral}`, [
        { text: '好的', onPress: () => {} },
      ]);
      return;
    }

    // 如果足够兑换1个，显示兑换弹出框
    this.setState({
      exchangeModalOpen: true,
    });
  };

  // 提交兑换
  exchangeGood = submitData => {
    const { dispatch, detail, userInfo } = this.props;
    const { restIntegral = 0, usedIntegral = 0, id: userId } = userInfo;

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
              ...submitData,
            },
          }).then(success => {
            Toast.hide();
            if (success) {
              const payIntegral = detail.integral * submitData.count;
              // 去更新用户的乐蚁果情况
              this.updateDriverIntegral({
                id: userId,
                restIntegral: restIntegral - payIntegral,
                usedIntegral: usedIntegral + payIntegral,
              });

              // 兑换方式不同，提示的信息不同
              const { exchangeType } = submitData;
              let desc = '';
              if (exchangeType === GOOD_EXCHANGE_TYPE_SELF_MAIL) {
                desc = `恭喜您已成功兑换[${detail.name}]，请您及时查收快递哦！`;
              } else {
                desc = '请到取货地址及时取货';
              }

              Modal.alert('兑换成功', desc, [
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
    const { exchangeModalOpen } = this.state;
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

    // 计算最多可以兑换多少个商品
    let maxExchangeCount = 0;
    // 计算最多可以兑换多少个商品
    const { restIntegral = 0 } = userInfo;
    const { integral } = detail;
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(restIntegral) && !isNaN(integral) && +integral !== 0) {
      maxExchangeCount = Math.floor(restIntegral / integral);
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
                    <span className={styles.active} onClick={() => this.handleClickExchangeBtn()}>
                      兑换
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
              <div>
                <FormWrapper
                  userInfo={userInfo}
                  maxExchangeCount={maxExchangeCount}
                  onOk={this.handleSubmit}
                  onCancle={this.handleCloseModal}
                />
              </div>
            </Popup>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default Detail;
