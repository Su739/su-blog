import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm, propTypes } from 'redux-form';
import axios from 'axios';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import actions from '../actions';
import MaterialField from '../components/reduxFormFieldComponent/MaterialField';
import AuthFormPane from '../components/AuthFormPane';
import rootUrls from '../utils/rootUrl';

const { MaterialTextField } = MaterialField;

const loginSubmit = ({ username, password }) => {
  console.log(username); return axios.post(`${rootUrls}/auth/login`, { username, password }, { withCredentials: true });
};

const LoginForm = (props) => {
  const {
    displayLoginForm, submitting, pristine, isLogged, loginForm,
    handleSubmit, toggleLoginForm
  } = props;

  console.log(props);

  if (displayLoginForm && !isLogged) {
    return (
      <AuthFormPane toggleLoginForm={toggleLoginForm}>
        <form className="login-form">
          <div>
            <Field
              name="username"
              label="账号/Email："
              component={MaterialTextField}
            />
          </div>
          <div>
            <Field
              name="password"
              label="密码："
              component={MaterialTextField}
              type="password"
            />
          </div>
          <div>
            {submitting ? <CircularProgress />
            :
            <FlatButton
              backgroundColor="#2196f3"
              hoverColor="#0473cc"
              style={{ margin: '10px 0', color: '#fff', width: '180px' }}
              type="submit"
              disabled={pristine || submitting}
              onClick={handleSubmit(loginSubmit, props, true)}
            >
            登 录
            </FlatButton>}
          </div>
        </form>
      </AuthFormPane>
    );
  }
  return null;
};
LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  displayLoginForm: PropTypes.bool,
  toggleLoginForm: PropTypes.func.isRequired,
  isLogged: PropTypes.bool,
  ...propTypes
};

const mapStateToProps = (state) => {
  const {
    auth: { isLogged, refreshAuthentication },
    ui: { popwindow: { displayLoginForm } },
    form: { loginForm }
  } = state;

  return {
    isLogged,
    refreshAuthentication,
    displayLoginForm,
    loginForm
  };
};


const {
  toggleLoginForm, toggleRegisterForm, refreshAuthentication
} = actions;
export default withRouter(reduxForm({
  form: 'loginForm',
  enableReinitialize: true,
  onSubmitSuccess: (result, dispatch) => {
    dispatch(refreshAuthentication(true, result.data.name));
    dispatch(toggleLoginForm(false));
  }
})(connect(mapStateToProps, {
  toggleLoginForm,
  toggleRegisterForm
})(LoginForm)));
