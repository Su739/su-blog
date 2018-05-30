import React from 'react';
import PropTypes from 'prop-types';
import './AuthFormPane.css';


const Modal = (props) => {
  // closeModal 可以接收上一级的method，然后set上一级的state或者dispath
  // display 是一个标志位，closeModal就是把他设置为false
  const { closeModal } = props;
  console.log(props);
  return (
    <div
      className="pop-pane-mask"
      onClick={(e) => {
        e.preventDefault();
        if (e.target.className === 'pop-pane-wrapper') {
          closeModal();
        }
      }}
      role="presentation"
    >
      <div className="pop-pane-wrapper">
        {props.children}
      </div>
    </div>
  );
};
Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  children: PropTypes.node
};


export default Modal;
