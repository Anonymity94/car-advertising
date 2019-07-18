import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import {
  Card,
  Divider,
  Form,
  Row,
  Col,
  Input,
  Button,
  Icon,
  DatePicker,
  Select,
  Spin,
  notification,
} from 'antd';
import isEqual from 'lodash/isEqual';
import { handleSearch, handleSearchReset, handleFilterResult } from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import FormModal, { ACCESS_PASTE, REJECT_PASTE } from './FormModal';
import {
  AD_PASTE_STATE_LIST,
  AD_PASTE_STATE_UN_REVIEW,
  AD_PASTE_STATE_PASTED,
  AD_PASTE_STATE_REFUSE,
} from '@/common/constants';

const FormItem = Form.Item;

@Form.create()
@connect(({ adSigningModel: { list }, loading }) => ({
  list,
  loading: loading.effects['adSigningModel/queryAdPastes'],
  submitLoading:
    loading.effects['adSigningModel/accessAdPaste'] ||
    loading.effects['adSigningModel/rejectAdPaste'],
}))
class AdPasteList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      isScaning: false,

      operateType: '', // 是否允许粘贴广告
      current: {}, // 当前操作的签约记录

      // eslint-disable-next-line react/no-unused-state
      search: {},

      list: [],
      filterResult: [],
    };

    this.handleSearchReset = handleSearchReset.bind(this);
    this.handleSearch = handleSearch.bind(this);
    this.handleFilterResult = handleFilterResult.bind(this);
  }

  componentDidMount() {
    this.queryAdPastes();
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

  queryAdPastes = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adSigningModel/queryAdPastes',
    });
  };

  toogleScaning = isScaning => {
    const { isScaning: oldIsScaning } = this.setState;
    if (isScaning === oldIsScaning) return;

    this.setState({
      isScaning,
    });

    notification.destroy();
    // 如果开始扫码，给个提示
    if (isScaning) {
      notification.info({
        message: '扫码中...',
        duration: null,
      });
    } else {
      notification.success({
        message: '扫码结束',
        duration: 2,
      });
    }
  };

  toogleModal = (current, operateType) => {
    this.setState(({ modalVisible }) => ({
      modalVisible: !modalVisible,
      current: current || {},
      operateType: current ? operateType : '',
    }));
  };

  handleSubmit = values => {
    const { operateType } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type:
        operateType === ACCESS_PASTE
          ? 'adSigningModel/accessAdPaste'
          : 'adSigningModel/rejectAdPaste',
      payload: {
        ...values,
      },
    }).then(success => {
      if (success) {
        // 关闭弹出
        this.toogleModal();
        // 重新拉取表格
        this.queryAdPastes();
      }
    });
  };

  renderSearchForm = () => {
    const {
      form: { getFieldDecorator },
      location: { query },
    } = this.props;

    const { username, pasteTime, pasteState } = query;

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
            <FormItem label="粘贴日期">
              {getFieldDecorator('pasteTime', {
                initialValue: pasteTime ? moment(pasteTime) : undefined,
              })(
                <DatePicker disabledDate={current => current && current > moment().endOf('day')} />
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="状态">
              {getFieldDecorator('pasteState', {
                initialValue: pasteState,
              })(
                <Select placeholder="请选择粘贴状态">
                  <Select.Option key="" value="">
                    全部
                  </Select.Option>
                  {AD_PASTE_STATE_LIST.map(item => (
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
    const { modalVisible, current, operateType, filterResult, isScaning } = this.state;
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
        title: '粘贴/拒绝日期',
        dataIndex: 'pasteTime',
        align: 'center',
        render: text => text && moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '粘贴状态',
        dataIndex: 'pasteState',
        align: 'center',
        render: text => {
          if (!text || text === AD_PASTE_STATE_UN_REVIEW) return '未审核';
          if (text === AD_PASTE_STATE_PASTED) return '已粘贴';
          if (text === AD_PASTE_STATE_REFUSE) return '拒绝';
          return '';
        },
      },
      {
        title: '审核人',
        dataIndex: 'pastePerson',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        width: 140,
        render: (text, record) => (
          <Fragment>
            {(record.pasteState === AD_PASTE_STATE_UN_REVIEW || !record.pasteState) && [
              <a onClick={() => this.toogleModal(record, ACCESS_PASTE)}>粘贴</a>,
              <Divider type="vertical" />,
              <a onClick={() => this.toogleModal(record, REJECT_PASTE)}>拒绝</a>,
              <Divider type="vertical" />,
            ]}
            <Link to={`/application/ad-signings/paste/detail?id=${record.id}`}>详情</Link>
          </Fragment>
        ),
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
          <Spin
            tip="扫码中..."
            spinning={isScaning}
            indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
          >
            {this.renderSearchForm()}
          </Spin>
        </Card>
        <Card bodyStyle={{ padding: 0 }} bordered={false}>
          <StandardTable
            title={() => (
              <div style={{ textAlign: 'right' }}>
                <Button
                  icon="play-circle"
                  type="primary"
                  onClick={() => this.toogleScaning(true)}
                  style={{ marginRight: 10 }}
                >
                  开始扫码
                </Button>
                <Button icon="stop" type="danger" onClick={() => this.toogleScaning(false)}>
                  结束扫码
                </Button>
              </div>
            )}
            rowKey="id"
            loading={loading}
            columns={tableColumns}
            data={{ list: filterResult }}
            rowClassName={record => (record.pasteState === AD_PASTE_STATE_UN_REVIEW ? 'trStrikingBg' : '')}
          />
        </Card>
        <FormModal
          operateType={operateType}
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
