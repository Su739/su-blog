import React from 'react';
import PropTypes from 'prop-types';
import Close from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import './AuthFormPane.css';


const LoginForm = (props) => {
  const { toggleLoginForm } = props;

  return (
    <div
      className="pop-pane-mask"
      onClick={(e) => {
        e.preventDefault();
        if (e.target.className === 'pop-pane-wrapper') {
          toggleLoginForm(false);
        }
      }}
      role="presentation"
    >
      <div className="pop-pane-wrapper">
        <div className="pop-pane-container">
          <h3 className="login-form-title">
            登&nbsp;&nbsp;&nbsp;录
            <IconButton
              style={{
                position: 'absolute', top: '-7px', right: '-7px', padding: '12px'
              }}
              iconStyle={{ width: 18, height: 18, color: 'red' }}
              tooltip="关闭"
              onClick={() => toggleLoginForm(false)}
            >
              <Close />
            </IconButton>
          </h3>
          {props.children}
        </div>
      </div>
    </div>
  );
};
LoginForm.propTypes = {
  toggleLoginForm: PropTypes.func.isRequired,
  children: PropTypes.node
};


export default LoginForm;
