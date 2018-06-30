
// 注意，CodeMirror 是从浏览器中导入的

import React from 'react';
import PropTypes from 'prop-types';

let CodeMirror;

// adapted from:
// https://github.com/facebook/react/blob/master/docs/_js/live_editor.js#L16

// also used as an example:
// https://github.com/facebook/react/blob/master/src/browser/ui/dom/components/ReactDOMInput.js

/* eslint-disable */
let IS_MOBILE =
  typeof navigator === 'undefined' ||
  (navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i));

if (!IS_MOBILE) {
  CodeMirror = window.CodeMirror;
}
/* eslint-enable */

class CodeMirrorEditor extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    style: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    forceTextArea: PropTypes.bool,
    textAreaStyle: PropTypes.string,
    readOnly: PropTypes.bool
  };
  constructor(props) {
    super(props);
    this.state = {
      isControlled: this.props.value !== null
    };
    this.editor = null;
    this.setEditor = this.setEditor.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  setEditor(elem) {
    this.editor = elem;
  }

  // Various CodeMirror-related objects emit events,
  // which allow client code to react to various situations.
  // Handlers for such events can be registered with the
  // on and off methods on the objects that the event fires on.
  componentDidMount() {
    const isTextArea = this.props.forceTextArea || IS_MOBILE;
    if (!isTextArea) {
      this.editor = CodeMirror.fromTextArea(this.editor, this.props);
      this.editor.on('change', this.handleChange);
    }
  }

  componentDidUpdate() {
    if (this.editor) {
      if (this.props.value != null) {
        if (this.editor.getValue() !== this.props.value) {
          this.editor.setValue(this.props.value);
        }
      }
    }
  }

  componentWillUnmount() {
    this.editor.off('change', this.handleChange);
  }

  handleChange() {
    if (this.editor) {
      const value = this.editor.getValue();
      if (value !== this.props.value) {
        this.props.onChange(value);
        if (this.editor.getValue() !== this.props.value) {
          if (this.state.isControlled) {
            this.editor.setValue(this.props.value);
          } else {
            this.props.value = value;
          }
        }
      }
    }
  }

  render() {
    const {
      value,
      defaultValue,
      readOnly,
      className,
      onChange,
      textAreaStyle
    } = this.props;
    return (
      <div style={this.props.style} className={this.props.className}>
        <textarea
          ref={this.setEditor}
          value={value}
          readOnly={readOnly}
          defaultValue={defaultValue}
          onChange={onChange}
          style={textAreaStyle}
          className={className}
        />
      </div>
    );
  }
}

export default CodeMirrorEditor;
