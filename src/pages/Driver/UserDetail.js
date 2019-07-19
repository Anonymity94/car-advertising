import React, { memo, Fragment } from 'react';
import moment from 'moment';
import Zmage from 'react-zmage';
import { Card, Descriptions, Divider, Row, Col, DatePicker, Icon } from 'antd';

import styles from './styles.less';

const UserDetail = memo(({ detail, loading, editable = false, onDataChange }) => (
  <Card bordered={false} loading={loading}>
    {!loading && !detail.id ? (
      <div className={styles.userEmpty}>
        <Icon type="warning" />
        <h3>用户不存在或已被删除</h3>
      </div>
    ) : (
      <Fragment>
        <Descriptions title="基础信息" bordered size="small" column={4}>
          <Descriptions.Item label="姓名">{detail.username}</Descriptions.Item>
          <Descriptions.Item label="联系方式">{detail.phone}</Descriptions.Item>
          <Descriptions.Item label="身份证号码">{detail.idcard}</Descriptions.Item>
        </Descriptions>
        <Divider />
        <section>
          <Descriptions title="身份信息" size="small" />
          <Row gutter={10}>
            <Col span={6}>
              <p>身份证人像面照片</p>
              <Zmage className={styles.img} src={detail.idcardBackImage} alt="身份证人像面照片" />
            </Col>
            <Col span={6}>
              <p>身份证国徽面照片</p>
              <Zmage className={styles.img} src={detail.idcardFrontImage} alt="身份证国徽面照片" />
            </Col>
          </Row>
        </section>
        <Divider />
        <section>
          <Descriptions title="车辆信息" bordered size="small" column={4}>
            <Descriptions.Item label="车辆类型">{detail.carType}</Descriptions.Item>
            <Descriptions.Item label="行驶证号">{detail.carCode}</Descriptions.Item>
            <Descriptions.Item label="证件到期时间">
              {editable ? (
                <DatePicker
                  allowClear={false}
                  defaultValue={detail.expireTime ? moment(detail.expireTime) : undefined}
                  onChange={onDataChange}
                />
              ) : (
                <span>
                  {detail.expireTime ? moment(detail.expireTime).format('YYYY-MM-DD') : ''}
                </span>
              )}
            </Descriptions.Item>
          </Descriptions>
          <Row style={{ marginTop: 10 }} gutter={10}>
            <Col span={6}>
              <p>行驶证照片</p>
              <Zmage className={styles.img} src={detail.carCodeImage} alt="行驶证照片" />
            </Col>
            <Col span={6}>
              <p>驾驶证照片</p>
              <Zmage className={styles.img} src={detail.driverLicenseImage} alt="驾驶证照片" />
            </Col>
            <Col span={6}>
              <p>车辆照片</p>
              <Zmage className={styles.img} src={detail.carImage} alt="车辆照片" />
            </Col>
          </Row>
        </section>
      </Fragment>
    )}
  </Card>
));

export default UserDetail;
