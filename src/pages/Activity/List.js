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
  Select,
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
  PUBLISH_STATE_LIST,
} from '@/common/constants';

const FormItem = Form.Item;

@Form.create()
@connect(({ activityModel: { list }, loading }) => ({
  list,
  loading: loading.effects['activityModel/queryActivities'],
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
      type: 'activityModel/publishActivity',
      payload: {
        id,
        isPublish,
      },
    });
  };

  handleTop = (id, isTop) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityModel/topActivity',
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
          type: 'activityModel/deleteActivity',
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

    const { title, activityTime, isPublish } = query;

    return (
      <Form className="searchForm" onSubmit={this.handleSearch} layout="inline">
        <Row gutter={10}>
          <Col md={6}>
            <FormItem label="名称">
              {getFieldDecorator('title', {
                initialValue: title,
              })(<Input placeholder="输入活动标题查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="活动日期">
              {getFieldDecorator('activityTime', {
                initialValue: activityTime ? moment(activityTime) : undefined,
              })(<DatePicker placeholder="输入活动日期查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="发布状态">
              {getFieldDecorator('isPublish', {
                initialValue: isPublish,
              })(
                <Select placeholder="请选择发布状态">
                  <Select.Option key="" value="">
                    全部
                  </Select.Option>
                  {PUBLISH_STATE_LIST.map(item => (
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
  }

  render() {
    const { filterResult } = this.state;
    const { loading } = this.props;

    const tableColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '活动标题',
        dataIndex: 'title',
        align: 'center',
      },
      {
        title: '主办方',
        dataIndex: 'company',
        align: 'center',
      },
      {
        title: '活动时间',
        dataIndex: 'activityTime',
        align: 'center',
        render: text => text && moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '最近操作时间',
        dataIndex: 'modifyTime',
        align: 'center',
        render: text => text && moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '发布时间',
        dataIndex: 'publishTime',
        align: 'center',
        render: text => text && moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '状态',
        dataIndex: 'state',
        align: 'center',
      },
      {
        title: '操作人',
        dataIndex: 'operator',
        align: 'center',
      },
      {
        title: '参与数',
        dataIndex: 'joinCount',
        align: 'center',
      },
      {
        title: '浏览数',
        dataIndex: 'visitCount',
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
              <Link to={`/application/activities/${id}/update`}>修改</Link>
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
            title={() => (
              <div style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  onClick={() => router.push('/application/activities/create')}
                >
                  新增活动
                </Button>
              </div>
            )}
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
