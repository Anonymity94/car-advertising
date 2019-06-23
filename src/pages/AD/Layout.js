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
        tab: '签约金结算',
      },
    ];

    const { match, children, location } = this.props;

    return (
      <PageHeaderWrapper
        showback={location.pathname.indexOf('/detail') > -1}
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '').split('/')[0]}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default ADLayout;
