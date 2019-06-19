import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import numeral from 'numeral';
import moment from 'moment';
import { Card, Divider, Form, Row, Col, Input, Button, Icon, Popconfirm } from 'antd';
import { handlePageRefresh, handleSearchReset, handleTableChange } from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'umi/link';

const FormItem = Form.Item;

@Form.create()
@connect(({ adModel: { ads, pagination }, loading }) => ({
  ads,
  pagination,
  loading: loading.effects['adModel/queryAds'],
}))
class AdminList extends PureComponent {
  constructor(props) {
    super(props);

    this.handlePageRefresh = handlePageRefresh.bind(this);
    this.handleSearchReset = handleSearchReset.bind(this);
    this.handleTableChange = handleTableChange.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  queryData = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;

    dispatch({
      type: 'adModel/queryAds',
      payload: {
        ...query,
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.handlePageRefresh({
        ...fieldsValue,
        page: 1,
      });
    });
  };

  handleDelete = id => {
    const { dispatch, ads, pagination } = this.props;
    dispatch({
      type: 'adModel/deleteAd',
      payload: {
        id,
      },
    }).then(success => {
      if (success) {
        this.handlePageRefresh({
          page:
            // 如果删除前只有1条数据，并且页码不是1，就请求上一页数据
            ads.length === 1 && pagination.current > 1
              ? pagination.current - 1
              : pagination.current,
        });
      }
    });
  };

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      location: { query },
    } = this.props;

    const { fullName, userName } = query;

    return (
      <Form className="searchForm" onSubmit={this.handleSearch} layout="inline">
        <Row gutter={10}>
          <Col md={6}>
            <FormItem label="姓名">
              {getFieldDecorator('fullName', {
                initialValue: fullName,
              })(<Input placeholder="输入姓名查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="账号">
              {getFieldDecorator('userName', {
                initialValue: userName,
              })(<Input placeholder="输入账号查询" />)}
            </FormItem>
          </Col>
          <Col md={12}>
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
    const { ads, pagination, loading, submitLoading } = this.props;

    const tableColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '签约条款',
        dataIndex: 'clause',
        align: 'center',
        render: text => <a>{text}</a>,
      },
      {
        title: '签约金',
        dataIndex: 'bonus',
        align: 'center',
        render: bonus => `${numeral(bonus).format('0,0')}/月`,
      },
      {
        title: '积分',
        dataIndex: 'integral',
        align: 'center',
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
        title: '签约数',
        dataIndex: 'signingCount',
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
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handlePublish(record)}>发布</a>
            <Divider type="vertical" />
            <Link to={`/application/ads/${record.id}`}>修改</Link>
            <Divider type="vertical" />
            <Popconfirm
              title={`确定删除[${record.title}]吗？`}
              onConfirm={() => this.handleDelete(record.id)}
              okText="删除"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={() => this.handleTop(record)}>置顶</a>
          </Fragment>
        ),
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
            data={{ list: ads, pagination }}
            onChange={this.handleTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AdminList;
