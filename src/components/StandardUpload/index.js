import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal, Upload, Button } from 'antd';
import { MOCK_API_PREFIX } from '@/common/app';

export default class StandardUpload extends React.PureComponent {
  static propTypes = {
    fileType: PropTypes.oneOf(['image', 'file']), // 上传类型
    fileList: PropTypes.array, // 初试文件列表
    limit: PropTypes.number, // 最多限制几个
    onChange: PropTypes.func,
  };

  static defaultProps = {
    fileType: 'image',
    fileList: [],
    limit: 1,
    onChange: () => {},
  };

  state = {
    previewVisible: false,
    previewImage: '',
  };

  handlePreview = file => {
    const { fileType } = this.props;
    if (fileType === 'file') {
      window.open(file.url)
      return;
    }
    this.setState({
      previewImage: file.url,
      previewVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      previewImage: '',
      previewVisible: false,
    });
  };

  render() {
    const { fileType, fileList, limit, onChange, ...reset } = this.props;
    const list = fileList || [];
    const { previewVisible, previewImage } = this.state;
    const uploadButton =
      fileType === 'image' ? (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">上传</div>
        </div>
      ) : (
        <Button>
          <Icon type="upload" /> 上传
        </Button>
      );
    return (
      <div style={fileType === 'image' ? { minHeight: 112 } : null}>
        <Upload
          action={`${IS_DEV ? MOCK_API_PREFIX : ''}/api/upload`}
          listType="picture-card"
          fileList={list}
          onChange={onChange}
          onPreview={this.handlePreview}
          {...reset}
          name="file"
        >
          {list.length >= limit ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          closable={false}
          destroyOnClose
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
