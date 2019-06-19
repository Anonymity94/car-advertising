import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Card,
  Divider,
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  DatePicker,
  Modal,
  Icon,
} from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { handlePageRefresh, handleSearchReset, handleTableChange } from '@/utils/utils';
import {
  AUDIT_STATE_UNREVIEWED,
  AUDIT_STATE_PASSED,
  AUDIT_STATE_REFUSE,
  AUDIT_STATE_LIST,
} from '@/common/constants';

const FormItem = Form.Item;

@Form.create()
@connect(({ driverModel: { appeals, pagination }, loading }) => ({
  appeals,
  pagination,
  loading: loading.effects['driverModel/queryAppeals'],
}))
class AppealList extends PureComponent {
  constructor(props) {
    super(props);
    this.handlePageRefresh = handlePageRefresh.bind(this);
    this.handleSearchReset = handleSearchReset.bind(this);
    this.handleTableChange = handleTableChange.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleAudit = (id, state) => {
    const { dispatch } = this.props;

    if (!id) return;

    let confirmModal = null;

    const doUpdate = reason => {
      confirmModal.update({
        okButtonProps: {
          loading: true,
        },
      });
      dispatch({
        type: 'driverModel/updateAppealState',
        payload: {
          id,
          state,
          reason,
        },
      }).then(success => {
        if (success) {
          Modal.destroyAll();
          this.handlePageRefresh();
        } else {
          confirmModal.update({
            okButtonProps: {
              loading: false,
            },
          });
        }
      });
    };

    const confirmProps = {
      maskClosable: false,
      destroyOnClose: true,
      keyboard: false,
      okText: '确定',
      cancelText: '取消',
      autoFocusButton: true,
      loading: false,
    };

    if (state === AUDIT_STATE_PASSED) {
      confirmModal = Modal.confirm({
        title: '确定通过此条申诉吗？',
        ...confirmProps,
        onOk: () => {
          doUpdate();
          return Promise.reject();
        },
        onCancel: () => {},
      });
    } else {
      let reason = '';
      confirmModal = Modal.confirm({
        title: '确定驳回此条申诉吗？',
        ...confirmProps,
        content: (
          <Fragment>
            <div style={{ marginBottom: 10 }}>提交理由：</div>
            <Input.TextArea
              required
              autoFocus
              maxLength={512}
              ref={input => {
                this.reasonInput = input;
              }}
              placeholder="请输入申述未通过的原因！"
            />
          </Fragment>
        ),
        onOk: () => {
          reason = this.reasonInput.textAreaRef.value;
          if (!reason) {
            return Promise.reject();
          }
          doUpdate(reason);
          return true;
        },
      });
    }
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { createTime } = fieldsValue;
      this.handlePageRefresh({
        ...fieldsValue,
        createTime: createTime ? moment(createTime).format('YYYY-MM-DD') : '',
        page: 1,
      });
    });
  };

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      location: { query },
    } = this.props;

    const { name, createTime, state } = query;

    return (
      <Form className="searchForm" onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col md={6}>
            <FormItem label="姓名">
              {getFieldDecorator('name', {
                initialValue: name,
              })(<Input placeholder="输入姓名查询" />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="提交日期">
              {getFieldDecorator('createTime', {
                initialValue: createTime ? moment(createTime) : undefined,
              })(
                <DatePicker disabledDate={current => current && current > moment().endOf('day')} />
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="状态">
              {getFieldDecorator('state', {
                initialValue: state,
              })(
                <Select placeholder="请选择审核状态">
                  <Select.Option key="" value="">
                    全部
                  </Select.Option>
                  {AUDIT_STATE_LIST.map(item => (
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
    const { appeals, pagination, loading } = this.props;

    const tableColumns = [
      {
        title: '会员编号',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '旧手机号',
        dataIndex: 'oldTelephone',
        align: 'center',
      },
      {
        title: '新手机号',
        dataIndex: 'telephone',
        align: 'center',
      },
      {
        title: '申诉理由',
        dataIndex: 'description',
        align: 'center',
      },
      {
        title: '提交日期',
        dataIndex: 'createTime',
        align: 'center',
        render: text => text && moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '状态',
        dataIndex: 'stateText',
        align: 'center',
      },
      {
        title: '审核人',
        dataIndex: 'operatorName',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        width: 140,
        render: (text, record) => {
          const { id, state } = record;
          if (state === AUDIT_STATE_UNREVIEWED) {
            return (
              <Fragment>
                <Button
                  size="small"
                  type="link"
                  onClick={() => this.handleAudit(id, AUDIT_STATE_PASSED)}
                >
                  通过
                </Button>
                <Divider type="vertical" />
                <Button
                  size="small"
                  type="link"
                  onClick={() => this.handleAudit(id, AUDIT_STATE_REFUSE)}
                >
                  不通过
                </Button>
              </Fragment>
            );
          }
          return '';
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
            data={{ list: appeals, pagination }}
            onChange={this.handleTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AppealList;
