import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Modal from './Modal';
import './BlockedModal.css';

const BlockedModal = (props) => {
  const {
    title, okText, refuseText, closeModal,
    display, onOkClick, onCancelClick, onRefuseClick
  } = props;
  return (
    <div>
      <Modal
        closeModal={closeModal}
        title={title}
        display={display}
      >
        <div className="button-group">
          {okText && onOkClick &&
          <div>
            <RaisedButton
              label={okText}
              primary
              fullWidth
              onClick={onOkClick}
            />
          </div>}
          {refuseText && onRefuseClick &&
          <div>
            <RaisedButton
              label={refuseText}
              secondary
              fullWidth
              onClick={onRefuseClick}
            />
          </div>}
          <div>
            <RaisedButton
              label="取消"
              fullWidth
              onClick={onCancelClick}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

BlockedModal.propTypes = {
  title: PropTypes.string,
  display: PropTypes.bool,
  onOkClick: PropTypes.func,
  onRefuseClick: PropTypes.func,
  onCancelClick: PropTypes.func,
  okText: PropTypes.string,
  refuseText: PropTypes.string,
  closeModal: PropTypes.func
};

export default BlockedModal;
