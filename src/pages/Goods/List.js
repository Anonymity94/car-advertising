import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import {
  Card,
  Divider,
  Form,
  Row,
  Col,
  Input,
  Button,
  Icon,
  Popconfirm,
  Modal,
  DatePicker,
} from 'antd';
import { handleSearchReset, handleSearch, handleFilterResult } from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'umi/link';
import {
  TOP_STATE_NO,
  PUBLISH_STATE_NO,
  PUBLISH_STATE_YES,
  TOP_STATE_YES,
} from '@/common/constants';

const FormItem = Form.Item;

@Form.create()
@connect(({ goodsModel: { list }, loading }) => ({
  list,
  loading: loading.effects['goodsModel/queryGoods'],
}))
class ActivityList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line react/no-unused-state
      search: {},

      list: [],
      filterResult: [],
    };

    this.handleSearchReset = handleSearchReset.bind(this);
    this.handleSearch = handleSearch.bind(this);
    this.handleFilterResult = handleFilterResult.bind(this);
  }

  componentDidMount() {}

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

  handlePublish = (id, isPublish) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsModel/publishGoods',
      payload: {
        id,
        isPublish,
      },
    });
  };

  handleTop = (id, isTop) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsModel/topGoods',
      payload: {
        id,
        isTop,
      },
    });
  };

  handleDelete = ({ id }) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确认删除吗？',
      content: '删除后，该内容将无法恢复！！',
      keyboard: false,
      maskClosable: false,
      onOk: () => {
        dispatch({
          type: 'goodsModel/deleteGoods',
          payload: {
            id,
          },
        });
      },
    });
  };

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      location: { query },
    } = this.props;

    const { businessName, address, endTime } = query;

    return (
      <Form className="searchForm" onSubmit={this.handleSearch} layout="inline">
        <Row gutter={10}>
          <Col md={6}>
            <FormItem label="商户名称">
              {getFieldDecorator('businessName', {
                initialValue: businessName,
              })(<Input placeholder="输入商户名称查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="地址">
              {getFieldDecorator('address', {
                initialValue: address,
              })(<Input placeholder="输入地址查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="到期日期">
              {getFieldDecorator('endTime', {
                initialValue: endTime ? moment(endTime) : undefined,
              })(<DatePicker placeholder="输入到期日期查询" />)}
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
  }

  render() {
    const { filterResult } = this.state;
    const { loading } = this.props;

    const tableColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        align: 'center',
        width: 200
      },
      {
        title: '所属商户名称',
        dataIndex: 'businessName',
        align: 'center',
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '地址',
        dataIndex: 'address',
        align: 'center',
      },
      {
        title: '积分',
        dataIndex: 'integral',
        align: 'center',
      },
      {
        title: '发布时间',
        dataIndex: 'publishTime',
        align: 'center',
        render: text => text && moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '到期时间',
        dataIndex: 'endTime',
        align: 'center',
        render: text => text && moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '操作人',
        dataIndex: 'operator',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        width: 140,
        render: (text, record) => {
          const { id, isTop, isPublish } = record;

          let color = '';

          let publishText = '发布';
          let newPublishState = PUBLISH_STATE_YES;
          if (isPublish === PUBLISH_STATE_YES) {
            publishText = '下线';
            newPublishState = PUBLISH_STATE_NO;
            color = '#f5222d';
          }

          let topText = '置顶';
          let newTopState = TOP_STATE_YES;
          if (isTop === TOP_STATE_YES) {
            topText = '取消置顶';
            newTopState = TOP_STATE_NO;
          }

          return (
            <Fragment>
              <Popconfirm
                title={`确定${publishText}吗？`}
                onConfirm={() => this.handlePublish(id, newPublishState)}
                okText="确定"
                cancelText="取消"
              >
                <a style={color ? { color } : null}>{publishText}</a>
              </Popconfirm>
              <Divider key="divider" type="vertical" />
              <Popconfirm
                title={`确定${topText}吗？`}
                onConfirm={() => this.handleTop(id, newTopState)}
                okText="确定"
                cancelText="取消"
              >
                <a>{topText}</a>
              </Popconfirm>
              <br />
              <Link to={`/integral/goods/${id}/update`}>修改</Link>
              <Divider type="vertical" />
              <a onClick={() => this.handleDelete(record)}>删除</a>
            </Fragment>
          );
        },
      },
    ];

    return (
      <PageHeaderWrapper>
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
          <div className="searchWrap" />
          <StandardTable
            rowKey="id"
            loading={loading}
            columns={tableColumns}
            data={{ list: filterResult }}
            rowClassName={record => (record.isPublish === PUBLISH_STATE_NO ? 'trStrikingBg' : '')}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ActivityList;
