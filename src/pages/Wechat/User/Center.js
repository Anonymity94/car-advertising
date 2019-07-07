import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Flex, Modal } from 'antd-mobile';
import router from 'umi/router';

import styles from './Center.less';

import iconExchange from './icons/icon_exchange@2x.png';
import iconInfo from './icons/icon_info@2x.png';
import iconSettlement from './icons/icon_settlement@2x.png';
import iconSigning from './icons/icon_signing@2x.png';
import defaultAvatar from './icons/default_avatar.png';

const entries = [
  {
    icon: iconInfo,
    title: '个人资料',
    link: '/h5/user/info',
  },
  {
    icon: iconSettlement,
    title: '结算记录',
    link: '/h5/user/ad-settlement',
  },
  {
    icon: iconSigning,
    title: '签约记录',
    link: '/h5/user/ad-signing',
  },
  {
    icon: iconExchange,
    title: '兑换记录',
    link: '/h5/user/integral-exchange',
  },
];

@connect(({ login: { wechatUser } }) => ({
  wechatUser,
}))
class UserCenter extends PureComponent {
  handleLink = link => {
    const { wechatUser } = this.props;
    if (!wechatUser.id) {
      Modal.alert('暂未绑定帐号', '', [
        {
          text: '取消',
          onPress: () => {},
        },
        {
          text: '立即绑定',
          onPress: () => {
            router.push('/h5/user/bind');
          },
        },
      ]);
      return;
    }
    router.push(link);
  };

  render() {
    const {
      wechatUser,
      wechatUser: { username = '立即绑定', usedIntegral, restIntegral },
    } = this.props;
    return (
      <DocumentTitle title="个人中心">
        <Fragment>
          <section className={styles.header}>
            <div className={styles.info}>
              <img alt={username} src={wechatUser.avatar || defaultAvatar} />
              {username === '立即绑定' ? (
                <p style={{ color: '#00c7bd' }} onClick={() => router.push('/h5/user/bind')}>
                  {username}
                </p>
              ) : (
                <p>{username}</p>
              )}
            </div>
            <div>
              <Flex>
                <Flex.Item>
                  <div className={styles.integral}>
                    <p className={`${styles.number} ${styles.rest}`}>{restIntegral || 0}</p>
                    <p>可使用</p>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <div className={styles.integral}>
                    <p className={`${styles.number} ${styles.used}`}>{usedIntegral || 0}</p>
                    <p>已兑换</p>
                  </div>
                </Flex.Item>
              </Flex>
            </div>
          </section>
          <section className={styles.content}>
            {entries.map(item => (
              <div
                key={item.title}
                className={styles.item}
                onClick={() => this.handleLink(item.link)}
              >
                <img className={styles.icon} src={item.icon} alt={item.title} />
                <p className={styles.title}>{item.title}</p>
              </div>
            ))}
          </section>
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default UserCenter;
