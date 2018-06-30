import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Modal from './Modal';
import './BlockedModal.css';

const BlockedModal = (props) => {
  const {
    okText, refuseText, closeModal, display, onOkClick, onCancelClick, onRefuseClick
  } = props;
  return (
    display
      ?
        <div>
          <Modal
            closeModal={closeModal}
            title="当前文章还没有保存，请选择以下操作："
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
      :
      null
  );
};

BlockedModal.propTypes = {
  display: PropTypes.bool,
  onOkClick: PropTypes.func,
  onRefuseClick: PropTypes.func,
  onCancelClick: PropTypes.func,
  okText: PropTypes.string,
  refuseText: PropTypes.string,
  closeModal: PropTypes.func
};

export default BlockedModal;
