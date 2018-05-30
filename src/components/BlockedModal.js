import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Modal from './Modal';
import './BlockedModal.css';

class BlockedModal extends React.Component {
  static propTypes = {
    display: PropTypes.bool,
    onOkClick: PropTypes.func,
    onRefuseClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    okText: PropTypes.string,
    refuseText: PropTypes.string,
    closeModal: PropTypes.func
  }
  handleOkClick() {
    this.props.onOkClick();
    this.props.callback(true);
  }
  handleRefuseClick() {
    this.props.onRefuseClick();
  }
  handleCancelClick() {
    this.props.onCancelClick();
  }
  render() {
    const {
      okText, refuseText, closeModal, display
    } = this.props;
    console.log(this.props);
    return (
      display
        ?
          <div>
            <Modal closeModal={closeModal}>
              <div className="block-modal-cantaine">
                <div className="block-modal-title">
                  <p>当前文章还没有保存，请选择以下操作：</p>
                </div>
                <div className="button-group">
                  <div>
                    <RaisedButton
                      label={okText}
                      primary
                      fullWidth
                      onClick={this.handleOkClick}
                    />
                  </div>
                  <div>
                    <RaisedButton
                      label={refuseText}
                      secondary
                      fullWidth
                      onClick={this.handleRefuseClick}
                    />
                  </div>
                  <div>
                    <RaisedButton
                      label="取消"
                      fullWidth
                      onClick={this.handleCancelClick}
                    />
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        :
        null
    );
  }
}

export default BlockedModal;
