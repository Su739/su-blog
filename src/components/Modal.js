import React from 'react';
import PropTypes from 'prop-types';
import './Modal.css';


const Modal = (props) => {
  // closeModal 可以接收上一级的method，然后set上一级的state或者dispath
  // display 是一个标志位，closeModal就是把他设置为false
  const {
    closeModal, title, tips, width
  } = props;
  return (
    <div
      className="modal-mask"
      onClick={(e) => {
        e.preventDefault();
        if (e.target.className === 'modal-wrapper') {
          closeModal();
        }
      }}
      role="presentation"
    >
      <div className="modal-wrapper">
        <div className="modal-container" style={width && { width: `${width}` }}>
          {title &&
            <p className="modal-title">
              {title}
            </p>
          }
          {tips && <p className="modal-tips">{tips}</p>}
          <div className="modal-content">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};
Modal.propTypes = {
  width: PropTypes.number,
  title: PropTypes.string,
  tips: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  children: PropTypes.node
};


export default Modal;
