import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import isEqual from 'lodash/isEqual';
import { Card, Divider, Form, Row, Col, Input, Button, Icon, DatePicker, Select } from 'antd';
import { handleSearch, handleSearchReset, handleFilterResult } from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import FormModal from './FormModal';
import {
  SIGNING_GOLD_SETTLEMENT_STATE_LIST,
  SIGNING_GOLD_SETTLEMENT_STATE_SETTLED,
} from '@/common/constants';

const FormItem = Form.Item;

@Form.create()
@connect(({ adSigningModel: { list }, loading }) => ({
  list,
  loading: loading.effects['adSigningModel/queryAdSettlements'],
  submitLoading: loading.effects['adSigningModel/doSigningSettlement'],
}))
class AdPasteList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,

      current: {}, // 当前操作的签约记录

      // eslint-disable-next-line react/no-unused-state
      search: {},

      list: [],
      filterResult: [],

      userInfo: {}, // 某个人结算节分
      advInfo: {}, // 当前广告的详情
    };

    this.handleSearchReset = handleSearchReset.bind(this);
    this.handleSearch = handleSearch.bind(this);
    this.handleFilterResult = handleFilterResult.bind(this);
  }

  componentDidMount() {
    this.queryAdSettlements();
  }

  componentWillUnmount() {}

  static getDerivedStateFromProps(nextProps, state) {
    if (!isEqual(nextProps.list, state.list)) {
      return {
        list: nextProps.list,
        filterResult: nextProps.list,
      };
    }
    return null;
  }

  queryAdSettlements = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adSigningModel/queryAdSettlements',
    });
  };

  queryDriverDetail = userId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverModel/queryDriverDetail',
      payload: {
        id: userId,
      },
    }).then(userInfo => {
      this.setState({
        userInfo,
      });
    });
  };

  queryAdContent = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adModel/queryAdContent',
      payload: {
        id,
      },
    }).then(advInfo => {
      this.setState({
        advInfo,
      });
    });
  };

  toogleModal = current => {
    this.setState(
      ({ modalVisible }) => ({
        modalVisible: !modalVisible,
        current: current || {},
        userInfo: {}, // 清空用户信息
        advInfo: {}, // 清空广告的信息
      }),
      () => {
        if (current && current.userId) {
          this.queryDriverDetail(current.userId);
        }
        if (current && current.advId) {
          this.queryAdContent(current.advId);
        }
      }
    );
  };

  handleSubmit = values => {
    const { userInfo, advInfo } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'adSigningModel/doSigningSettlement',
      payload: {
        ...values,
      },
    }).then(success => {
      if (success) {
        // 如果同意完成了。
        const { id, usedIntegral = 0, restIntegral = 0 } = userInfo;
        // 同意完成，增加用户的积分情况
        // 如果用户存在再去增加积分
        if (userInfo.id && advInfo.id) {
          // 已使用积分不变
          // 新的积分 = 老的积分 + 广告的积分
          const newIntegral = restIntegral + (advInfo.integral || 0);
          // 更新用户的积分
          this.updateDriverIntegral({ id, restIntegral: newIntegral, usedIntegral });
        }

        // 关闭弹出
        this.toogleModal();
        // 重新拉取表格
        this.queryAdSettlements();
      }
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

  renderSearchForm = () => {
    const {
      form: { getFieldDecorator },
      location: { query },
    } = this.props;

    const { username, settlementTime, settlementState } = query;

    return (
      <Form className="searchForm" onSubmit={this.handleSearch} layout="inline">
        <Row gutter={10}>
          <Col md={6}>
            <FormItem label="姓名">
              {getFieldDecorator('username', {
                initialValue: username,
              })(<Input placeholder="输入姓名查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="结算日期">
              {getFieldDecorator('settlementTime', {
                initialValue: settlementTime ? moment(settlementTime) : undefined,
              })(
                <DatePicker disabledDate={current => current && current > moment().endOf('day')} />
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="状态">
              {getFieldDecorator('settlementState', {
                initialValue: settlementState,
              })(
                <Select placeholder="请选择结算状态">
                  <Select.Option key="" value="">
                    全部
                  </Select.Option>
                  {SIGNING_GOLD_SETTLEMENT_STATE_LIST.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem>
              <div className="searchFormOperate">
                <Button icon="search" type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button icon="reload" className="resetBtn" onClick={this.handleSearchReset}>
                  重置
                </Button>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const { modalVisible, current, filterResult } = this.state;
    const { loading, submitLoading } = this.props;

    const tableColumns = [
      {
        title: '会员编号',
        dataIndex: 'userId',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'username',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        align: 'center',
      },
      {
        title: '身份证号',
        dataIndex: 'idcard',
        align: 'center',
      },
      {
        title: '车辆类型',
        dataIndex: 'carType',
        align: 'center',
      },
      {
        title: '行驶证号',
        dataIndex: 'carCode',
        align: 'center',
      },
      {
        title: '证件到期时间',
        dataIndex: 'expireTime',
        align: 'center',
      },
      {
        title: '粘贴日期',
        dataIndex: 'pasteTime',
        align: 'center',
        render: text => text && moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '签约金额',
        dataIndex: 'bonus',
        align: 'center',
      },
      {
        title: '签约有效期',
        dataIndex: 'signingExpireTime',
        align: 'center',
      },
      {
        title: '结算日期',
        dataIndex: 'settlementTime',
        align: 'center',
        render: text => text && moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '状态',
        dataIndex: 'settlementState',
        align: 'center',
        render: text => (text === SIGNING_GOLD_SETTLEMENT_STATE_SETTLED ? '已结算' : '未结算'),
      },
      // {
      //   title: '审核人',
      //   dataIndex: 'settlementPerson',
      //   align: 'center',
      // },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        width: 140,
        render: (text, record) => {
          // 粘贴xxx天后，才可以结算
          const { pasteTime } = record;
          // 是否显示结算按钮
          const showFlag = true;
          // 可以显示结算按钮
          if (pasteTime) {
            const pasteTimeString = moment(pasteTime).format('YYYY-MM-DD');
            const today = moment().format('YYYY-MM-DD');
            const someDayAfter = moment(pasteTimeString).add(30, 'days');
            // 如果当前日期，在粘贴时间30之前，不应该显示结算按钮
            if (moment(someDayAfter) - moment(today) > 0) {
              // 暂时不做判断，方便测试
              // showFlag = false;
            }
          }
          return (
            <Fragment>
              {record.settlementState !== SIGNING_GOLD_SETTLEMENT_STATE_SETTLED && [
                <Button
                  disabled={!showFlag}
                  onClick={() => (showFlag ? this.toogleModal(record) : {})}
                >
                  结算
                </Button>,
                <Divider type="vertical" />,
              ]}
              <Link to={`/application/ad-signings/settlement/detail?id=${record.id}`}>详情</Link>
            </Fragment>
          );
        },
      },
    ];

    return (
      <Fragment>
        <Card
          size="small"
          bordered={false}
          title={
            <div>
              <Icon type="search" /> 筛选查询
            </div>
          }
          style={{ marginBottom: 10 }}
        >
          {this.renderSearchForm()}
        </Card>

        <Card bodyStyle={{ padding: 0 }} bordered={false}>
          <StandardTable
            rowKey="id"
            loading={loading}
            columns={tableColumns}
            data={{ list: filterResult }}
            rowClassName={record =>
              record.settlementState !== SIGNING_GOLD_SETTLEMENT_STATE_SETTLED ? 'trStrikingBg' : ''
            }
          />
        </Card>
        <FormModal
          current={current}
          confirmLoading={submitLoading}
          visible={modalVisible}
          onCancel={this.toogleModal}
          onSubmit={this.handleSubmit}
        />
      </Fragment>
    );
  }
}

export default AdPasteList;
