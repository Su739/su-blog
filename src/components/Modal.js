import React from 'react';
import PropTypes from 'prop-types';
import './AuthFormPane.css';


const LoginForm = (props) => {
  const { closeModal, closed } = props;
  console.log(props);
  return (
    !closed &&
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
LoginForm.propTypes = {
  closed: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  children: PropTypes.node
};


export default LoginForm;
