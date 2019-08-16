import React, { PureComponent } from 'react';
import { Table } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import styles from './index.less';

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);

    const { columns } = props;

    let tableColumnsProps = columns || [];

    // 如果开启自定义设置，从还原本地设置

    tableColumnsProps = tableColumnsProps.map(item => {
      if (item.dataIndex === 'id' || item.dataIndex === 'userId') {
        return {
          ...item,
          width: 100,
          render: text => (
            <Ellipsis tooltip lines={1} style={{ width: 100 }}>
              {text}
            </Ellipsis>
          ),
        };
      }
      if (['reason', 'remark', 'address', 'title'].indexOf(item.dataIndex) > -1) {
        return {
          ...item,
          width: 240,
          render: text => (
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>
          ),
        };
      }
      return item;
    });

    this.state = {
      selectedRowKeys: [],
      tableColumns: tableColumnsProps, // 表格显示列表
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRowKey && nextProps.selectedRows.length === 0) {
      return {
        selectedRowKeys: [],
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      // onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys, tableColumns } = this.state;
    const { data = {}, rowKey, onChange, ...rest } = this.props;
    const { list = [], pagination } = data;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      hideOnSinglePage: false,
      total: list.length,
      showTotal: total => `共 ${total} 条`,
      pageSize: 20,
      size: 'default',
      pageSizeOptions: ['10', '20', '30', '40', '50'],
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <Table
          rowKey={rowKey || 'id'}
          bordered
          size="small"
          // rowSelection={rowSelection}
          dataSource={list}
          pagination={paginationProps}
          scroll={{ x: '1300px' }}
          // onChange={this.handleTableChange}
          {...rest}
          columns={tableColumns}
        />
      </div>
    );
  }
}

export default StandardTable;
