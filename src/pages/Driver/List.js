import React, { PureComponent, Fragment } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { Card } from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const tableColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '手机号',
    dataIndex: 'telephone',
    align: 'center',
  },
  {
    title: '身份证号',
    dataIndex: 'identityCard',
    align: 'center',
  },
  {
    title: '提交日期',
    dataIndex: 'createTime',
    align: 'center',
    render: text => text && moment.format('YYYY-MM-DD'),
  },
  {
    title: '状态',
    dataIndex: 'state',
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
    render: (text, record) => (
      <Fragment>
        <Link to={`/application/drivers/${record.id}/info`}>审核</Link>
        <Link to={`/application/drivers/${record.id}/info`}>查看</Link>
      </Fragment>
    ),
  },
];

@connect(({ driverModel: { drivers, pagination } }) => ({
  drivers,
  pagination,
}))
class Workplace extends PureComponent {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { drivers, pagination } = this.props;
    return (
      <PageHeaderWrapper>
        <Card bodyStyle={{ padding: 0 }} bordered={false}>
          <div className="searchWrap" />
          <StandardTable rowKey="id" columns={tableColumns} data={{ list: drivers, pagination }} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
