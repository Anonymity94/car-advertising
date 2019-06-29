import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.less';
import emptyIcon from './empty.png';

const Empty = props => {
  const { text } = props;
  return (
    <div className={styles.emptyWrap}>
      <img src={emptyIcon} alt={text} />
      <p className={styles.empty}>{text}</p>
    </div>
  );
};

Empty.defaultProps = {
  text: '暂无记录',
};

Empty.propTypes = {
  text: PropTypes.string,
};

export default Empty;
