/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';
import ObserveDom from '@better-scroll/observe-dom';
import PullDown from '@better-scroll/pull-down';
import Pullup from '@better-scroll/pull-up';

import styles from './index.less';

BScroll.use(MouseWheel);
BScroll.use(ObserveDom);
BScroll.use(PullDown);
BScroll.use(Pullup);

class Scroll extends React.Component {
  constructor(props) {
    super(props);

    this.scrollViewRef = React.createRef();
  }

  componentDidMount() {
    if (!this.bScroll) {
      const { pullUpLoad, pullDownRefresh, click } = this.props;
      this.bScroll = new BScroll(this.scrollViewRef.current, {
        // 实时派发scroll事件
        probeType: 3,
        scrollY: true,

        click,

        // 开启上拉加载
        pullUpLoad,
        // 开启下拉刷新
        pullDownRefresh,
      });

      if (this.props.pullUpLoad && this.props.onPullUpLoad) {
        this.bScroll.on('pullingUp', this.props.onPullUpLoad);
      }

      if (this.props.pullDownRefresh && this.props.onPullDownRefresh) {
        this.bScroll.on('pullingDown', this.onPullDownRefresh);
      }
    }
    this.bScroll.refresh();
  }

  componentDidUpdate() {
    // 组件更新后，如果实例化了better-scroll并且需要刷新就调用refresh()函数
    if (this.bScroll && this.props.refresh === true) {
      this.bScroll.refresh();
    }
  }

  componentWillUnmount() {
    this.bScroll.off('scroll');
    this.bScroll = null;
  }

  refresh() {
    if (this.bScroll) {
      this.bScroll.refresh();
    }
  }

  render() {
    return (
      <div className={styles.scrollWrapper} ref={this.scrollViewRef}>
        {/* 获取子组件 */}
        <div>{this.props.children}</div>
      </div>
    );
  }
}

Scroll.defaultProps = {
  click: true,
  refresh: true,

  pullUpLoad: true,
  onPullUpLoad: () => {},

  pullDownRefresh: true,
  onPullDownRefresh: () => {},
};

Scroll.propTypes = {
  // 是否启用点击
  click: PropTypes.bool,
  // 是否刷新
  refresh: PropTypes.bool,

  pullUpLoad: PropTypes.bool,
  onPullUpLoad: PropTypes.func,

  pullDownRefresh: PropTypes.bool,
  onPullDownRefresh: PropTypes.func,
};

export default Scroll;
