import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect()
class ADLayout extends Component {
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'paste':
        router.push(`${match.url}/paste`);
        break;
      case 'settlement':
        router.push(`${match.url}/settlement`);
        break;
      default:
        break;
    }
  };

  handleFormSubmit = value => {
    // eslint-disable-next-line
    console.log(value);
  };

  render() {
    const tabList = [
      {
        key: 'paste',
        tab: '粘贴广告',
      },
      {
        key: 'settlement',
        tab: '签约金计算',
      },
    ];

    const { match, children, location } = this.props;

    return (
      <PageHeaderWrapper
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default ADLayout;
