import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd-mobile';
import router from 'umi/router';

import styles from './index.less';
import emptyIcon from './empty.png';

const Empty = props => {
  const { text, showback } = props;
  return (
    <div className={styles.emptyWrap}>
      <img src={emptyIcon} alt={text} />
      <p className={styles.empty}>{text}</p>

      {showback && (
        <Button className={styles.back} size="small" type="primary" onClick={() => router.goBack()}>
          返回
        </Button>
      )}
    </div>
  );
};

Empty.defaultProps = {
  text: '暂无记录',
  showback: true,
};

Empty.propTypes = {
  text: PropTypes.string,
  showback: PropTypes.bool,
};

export default Empty;
