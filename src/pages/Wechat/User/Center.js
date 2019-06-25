import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { Flex } from 'antd-mobile';

import Link from 'umi/link';

import styles from './Center.less';

import iconExchange from './icons/icon_exchange@2x.png';
import iconInfo from './icons/icon_info@2x.png';
import iconSettlement from './icons/icon_settlement@2x.png';
import iconSigning from './icons/icon_signing@2x.png';

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

// eslint-disable-next-line react/no-multi-comp
export default class UserCenter extends PureComponent {
  render() {
    return (
      <DocumentTitle title="个人中心">
        <Fragment>
          <section className={styles.header}>
            <div className={styles.info}>
              <img alt="姓名" src="https://avatars2.githubusercontent.com/u/13148447?s=56&v=4" />
              <p>姓名</p>
            </div>
            <div>
              <Flex>
                <Flex.Item>
                  <div className={styles.integral}>
                    <p className={`${styles.number} ${styles.rest}`}>2000</p>
                    <p>可使用</p>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <div className={styles.integral}>
                    <p className={`${styles.number} ${styles.used}`}>2000</p>
                    <p>已兑换</p>
                  </div>
                </Flex.Item>
              </Flex>
            </div>
          </section>
          <section className={styles.content}>
            {entries.map(item => (
              <Link to={item.link} key={item.title} className={styles.item}>
                <img className={styles.icon} src={item.icon} alt={item.title} />
                <p className={styles.title}>{item.title}</p>
              </Link>
            ))}
          </section>
        </Fragment>
      </DocumentTitle>
    );
  }
}
