import React, { memo } from 'react';
import { Card, Descriptions, Divider, Row, Col } from 'antd';

import styles from './styles.less';

const UserDetail = memo(({ detail, loading }) => (
  <Card bordered={false} loading={loading}>
    <Descriptions title="基础信息" bordered size="small">
      <Descriptions.Item label="姓名">{detail.name}</Descriptions.Item>
      <Descriptions.Item label="联系方式">{detail.telephone}</Descriptions.Item>
      <Descriptions.Item label="身份证号码">{detail.identityCard}</Descriptions.Item>
    </Descriptions>
    <Divider />
    <section>
      <Descriptions title="身份信息" size="small" />
      <Row gutter={10}>
        <Col span={6}>
          <img className={styles.img} src={detail.identityCardImage1} alt="身份证国徽照片" />
        </Col>
        <Col span={6}>
          <img className={styles.img} src={detail.identityCardImage2} alt="身份证人脸照片" />
        </Col>
      </Row>
    </section>
    <Divider />
    <section>
      <Descriptions title="车辆信息" bordered size="small">
        <Descriptions.Item label="车辆类型">{detail.name}</Descriptions.Item>
        <Descriptions.Item label="行驶证号">{detail.telephone}</Descriptions.Item>
        <Descriptions.Item label="证件到期时间">{detail.identityCard}</Descriptions.Item>
      </Descriptions>
      <Row style={{ marginTop: 10 }} gutter={10}>
        <Col span={6}>
          <img className={styles.img} src={detail.drivingPermitImage} alt="行驶证" />
        </Col>
        <Col span={6}>
          <img className={styles.img} src={detail.driverLicenseImage} alt="驾驶证" />
        </Col>
        <Col span={6}>
          <img className={styles.img} src={detail.carImgae} alt="车辆照片" />
        </Col>
      </Row>
    </section>
  </Card>
));

export default UserDetail;
