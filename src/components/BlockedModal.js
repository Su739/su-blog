import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Modal from './Modal';

class BlockedModal extends React.Component {
  static propTypes = {
    closed: PropTypes.bool,
    onOkClick: PropTypes.func,
    onRefuseClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    okText: PropTypes.string,
    refuseText: PropTypes.string,
    closeModal: PropTypes.func
  }
  handleOkClick() {
    this.props.onOkClick();
  }
  handleRefuseClick() {
    this.props.onRefuseClick();
  }
  handleCancelClick() {
    this.props.onCancelClick();
  }
  render() {
    const {
      okText, refuseText, closeModal, closed
    } = this.props;
    return (
      <div>
        <Modal closeModal={closeModal} closed={closed}>
          <div>
            <RaisedButton
              label={okText}
              backgroundColor="#28a745"
              fullWidth
              onClick={this.handleOkClick}
            />
          </div>
          <div>
            <RaisedButton
              label={refuseText}
              backgroundColor="#dc3545"
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
        </Modal>
      </div>
    );
  }
}

export default BlockedModal;
