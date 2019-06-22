import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

class StandardTable extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

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
    const { selectedRowKeys } = this.state;
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
          // onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
