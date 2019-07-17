import React, { PureComponent } from 'react';
import { Upload, Icon, message } from 'antd';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import { MOCK_API_PREFIX } from '@/common/app';

import 'braft-editor/dist/index.css';
import styles from './index.less';

const controls = [
  // 'undo',
  // 'redo',
  // 'separator',
  'headings',
  'font-size',
  // 'line-height',
  // 'letter-spacing',
  'separator',
  'text-color',
  'bold',
  'italic',
  // 'underline',
  // 'strike-through',
  // 'separator',
  // 'superscript', 'subscript', 'emoji',  'separator',
  'text-align',
  // 'separator',
  'list-ul',
  'list-ol',
  // 'blockquote',
  'link',
  // 'separator',
  // 'separator',
  // 'media', 'separator',
  // 'remove-styles', 'clear'
];

/**
 * 富文本编辑器
 */
export default class RichTextEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editorState: BraftEditor.createEditorState(props.value || null),
    };

    this.extendControls = [
      // 扩展组件
      {
        key: 'antd-uploader',
        type: 'component',
        className: 'richTextEditor-antd-uploader',
        component: (
          <div className="control-item">
            <Upload
              accept="image/*"
              action={`${IS_DEV ? MOCK_API_PREFIX : ''}/api/upload`}
              onChange={this.handleUploadChange}
              showUploadList={false}
            >
              {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
              <button
                type="button"
                className="control-item button upload-button"
                data-title="插入图片"
                style={{ margin: 0 }}
              >
                <Icon type="picture" theme="filled" />
              </button>
            </Upload>
          </div>
        ),
      },
      'fullscreen',
      // 'separator',
      // {
      //   key: 'custom-button',
      //   type: 'button',
      //   text: '预览',
      //   onClick: this.preview,
      // },
    ];
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if ('value' in nextProps) {
      const editorState = nextProps.value;
      this.setState({
        editorState,
      });
    }
  }

  triggerBlur = editorState => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(editorState);
    }
  };

  customHandlePastedText = (text, html, editorState, editor) => {
    console.log(html);
    editor.setValue(ContentUtils.insertHTML(editorState, html, 'paste'));
  };

  handleEditorBlur = editorState => {
    this.setState(
      {
        editorState,
      },
      () => {
        this.triggerBlur(editorState);
      }
    );
  };

  // 预览
  preview = () => {
    if (window.previewWindow) {
      window.previewWindow.close();
    }
    window.previewWindow = window.open();
    window.previewWindow.document.write(this.buildPreviewHtml());
    window.previewWindow.document.close();
  };

  // 上传图片组件 onChange事件
  handleUploadChange = info => {
    const { editorState } = this.state;

    if (info.file.status === 'uploading') {
      message.loading('图片上传中', 0);
      return;
    }
    message.destroy();

    if (info.file.status === 'done') {
      const { url } = info.file.response;
      this.setState({
        editorState: ContentUtils.insertMedias(editorState, [
          {
            type: 'IMAGE',
            url,
          },
        ]),
      });
    }
  };

  // 构建预览html
  buildPreviewHtml() {
    const { editorState } = this.state;
    return `
        <!Doctype html>
        <html>
            <head>
            <title>预览</title>
            <style>
                html,body {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    overflow: auto;
                    background-color: #f1f2f3;
                }
                .container {
                    box-sizing: border-box;
                    width: 1000px;
                    max-width: 100%;
                    min-height: 100%;
                    margin: 0 auto;
                    padding: 30px 20px;
                    overflow: hidden;
                    background-color: #fff;
                    border-right: solid 1px #eee;
                    border-left: solid 1px #eee;
                }
                .container img,
                .container audio,
                .container video {
                    max-width: 100%;
                    height: auto;
                }
                .container p {
                    white-space: pre-wrap;
                    min-height: 1em;
                }
                .container pre {
                    padding: 15px;
                    background-color: #f1f1f1;
                    border-radius: 5px;
                }
                .container blockquote {
                    margin: 0;
                    padding: 15px;
                    background-color: #f1f1f1;
                    border-left: 3px solid #d1d1d1;
                }
            </style>
        </head>
        <body>
            <div class="container">${editorState ? editorState.toHTML() : ''}</div>
        </body>
    </html>
    `;
  }

  render() {
    const { editorState } = this.state;
    const { placeholder = '请输入内容' } = this.props;
    return (
      <div className={styles.braftEditor}>
        <p
          style={{ color: 'red', marginBottom: 0, lineHeight: '22px', height: 22, paddingLeft: 10 }}
        >
          粘贴文字后，为防止提交失败，请检查是否存在非法换行。
        </p>
        <BraftEditor
          controls={controls}
          placeholder={placeholder}
          value={editorState}
          extendControls={this.extendControls}
          handlePastedText={this.customHandlePastedText}
          onBlur={this.handleEditorBlur}
        />
      </div>
    );
  }
}
