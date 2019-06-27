import React, { PureComponent } from 'react';

import { PullToRefresh, ListView, Button } from 'antd-mobile';

const data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: 'Meet hotel',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: "McDonald's invites you",
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
    title: 'Eat the week',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
];
const NUM_ROWS = 20;
let pageIndex = 0;

class List extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource,
      refreshing: true,
      isLoading: true,
    };
  }

  // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.dataSource !== this.props.dataSource) {
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRows(nextProps.dataSource),
  //     });
  //   }
  // }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows([]),
        refreshing: false,
        isLoading: false,
      });
    }, 1500);
  }

  onRefresh = () => {
    this.setState({ refreshing: true, isLoading: true });
    // simulate initial Ajax
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows([]),
        refreshing: false,
        isLoading: false,
      });
    }, 600);
  };

  onEndReached = event => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.rData = [...this.rData, ...genData(++pageIndex)];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
      });
    }, 1000);
  };

  render() {
    let index = data.length - 1;
    const row = (rowData, sectionID, rowID) => {
      console.log(rowData);
      if (index < 0) {
        index = data.length - 1;
      }
      const obj = data[index--];
      return (
        <div key={rowID} style={{ width: '50%', float: 'left' }}>
          <div
            style={{
              height: '50px',
              lineHeight: '50px',
              color: '#888',
              fontSize: '18px',
              borderBottom: '1px solid #ddd',
            }}
          >
            {rowID}
          </div>
          <div style={{ display: '-webkit-box', display: 'flex', padding: '15px' }}>
            <img
              style={{ height: '63px', width: '63px', marginRight: '15px' }}
              src={obj.img}
              alt=""
            />
            <div style={{ display: 'inline-block' }}>
              <div
                style={{
                  marginBottom: '8px',
                  color: '#000',
                  fontSize: '16px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '250px',
                }}
              >
                {obj.des}-{rowData}
              </div>
              <div style={{ fontSize: '16px' }}>
                <span style={{ fontSize: '30px', color: '#FF6E27' }}>{rowID}</span> 元/任务
              </div>
            </div>
          </div>
        </div>
      );
    };
    return (
      <div>
        <ListView
          ref={el => (this.lv = el)}
          dataSource={this.state.dataSource}
          renderFooter={() => (
            <div style={{ padding: 30, textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : 'Loaded'}
            </div>
          )}
          renderRow={row}
          useBodyScroll
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          pullToRefresh={
            <PullToRefresh refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }
          onEndReached={this.onEndReached}
          pageSize={5}
        />
      </div>
    );
  }
}

export default List;
