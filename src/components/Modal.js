import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import './Modal.css';


class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isPending: false };
  }
  render() {
  // closeModal 可以接收上一级的method，然后set上一级的state或者dispath
  // display 是一个标志位，closeModal就是把他设置为false
    const {
      maskClose, closeCB, title, tips, width, footer, display,
      okText, cancelText, onOkClick, onCancelClick, resolvedCB, rejectedCB
    } = this.props;
    const { isPending } = this.state;
    if (display) {
      return (
        <div
          className="modal-mask"
          onClick={(e) => {
        if (!maskClose) return;
        e.preventDefault();
        if (e.target.className === 'modal-wrapper') {
          closeCB();
        }
      }}
          role="presentation"
        >
          <div className="modal-wrapper">
            <div className="modal-container" style={{ width: `${width || '400px'}` }}>
              <div className="modal-header">
                {title &&
                <p className="modal-title">
                  {title}
                </p>
            }
              </div>
              <div className="modal-content">
                {tips && <p className="modal-tips">{tips}</p>}
                {this.props.children}
              </div>
              <div className="modal-footer">
                {footer}
                <div className="modal-btn-group">
                  {okText && onOkClick &&
                  <RaisedButton
                    style={{ minWidth: 'none' }}
                    label={okText}
                    primary
                    icon={isPending && <CircularProgress size={20} thickness={2} />}
                    onClick={() => {
                    if (resolvedCB || rejectedCB) {
                      onOkClick()
                        .then(
                          (res) => {
                            this.setState({ isPending: false });
                            if (resolvedCB) {
                              resolvedCB(res);
                            }
                            closeCB();
                          },
                          (error) => {
                            this.setState({ isPending: false });
                            if (rejectedCB) {
                              rejectedCB(error);
                            }
                          }
                        );
                      this.setState({ isPending: true });
                    } else {
                      onOkClick();
                      closeCB();
                    }
                  }}
                  />}
                  {cancelText && onCancelClick &&
                  <RaisedButton
                    style={{ marginLeft: '1em', minWidth: 'none' }}
                    label={cancelText}
                    onClick={onCancelClick}
                  />}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}
Modal.propTypes = {
  maskClose: PropTypes.bool,
  display: PropTypes.bool,
  footer: PropTypes.node,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  onOkClick: PropTypes.func,
  onCancelClick: PropTypes.func,
  width: PropTypes.number,
  title: PropTypes.string,
  tips: PropTypes.string,
  closeCB: PropTypes.func,
  resolvedCB: PropTypes.func,
  rejectedCB: PropTypes.func,
  children: PropTypes.node
};


export default Modal;
