import React, { PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import { Button, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import router from 'umi/router';
import UserDetail from './UserDetail';

import styles from './styles.less';

@connect(({ driverModel: { detail }, loading }) => ({
  detail,
  loading: loading.effects['driverModel/queryDriverDetail'],
  submitting: loading.effects['driverModel/updateDrivingPermitDueTime'],
}))
class Audit extends PureComponent {
  state = {
    dueDate: '',
    width: '100%',
  };

  componentDidMount() {
    this.queryDriverDetail();
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  queryDriverDetail = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: 'driverModel/queryDriverDetail',
      payload: {
        id: params.id,
      },
    });
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  handleUpdate = () => {
    const { dueDate } = this.state;
    const { dispatch, detail } = this.props;
    const { id, drivingPermitDueTime } = detail;
    Modal.confirm({
      width: 500,
      title: (
        <div>
          确定将行驶证到期时间更改到 <b>{dueDate || drivingPermitDueTime}</b>吗？
        </div>
      ),
      onOk: () => {
        dispatch({
          type: 'driverModel/updateDrivingPermitDueTime',
          payload: {
            id,
            drivingPermitDueTime: dueDate || drivingPermitDueTime,
          },
        });
      },
    });
  };

  handleDateChange = (date, dateString) => {
    if (dateString) {
      this.setState({
        dueDate: dateString,
      });
    }
  };

  render() {
    const { width } = this.state;
    const { loading, detail, submitting } = this.props;

    return (
      <PageHeaderWrapper showback>
        <Suspense fallback={null}>
          <UserDetail
            detail={detail}
            loading={loading}
            editable
            onDataChange={this.handleDateChange}
          />
        </Suspense>

        {detail.id && (
          <FooterToolbar style={{ width }}>
            <section className={styles.operateWrap}>
              <Button icon="reload" type="dashed" onClick={() => this.queryDriverDetail()}>
                刷新
              </Button>
              <Button icon="save" loading={submitting} type="primary" onClick={() => this.handleUpdate()}>
                保存
              </Button>
              <Button icon="rollback" loading={submitting} onClick={() => router.goBack()}>
                返回
              </Button>
            </section>
          </FooterToolbar>
        )}
      </PageHeaderWrapper>
    );
  }
}

export default Audit;
