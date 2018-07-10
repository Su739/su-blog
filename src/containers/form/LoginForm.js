import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, propTypes, SubmissionError } from 'redux-form';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import { required, validUserName, validPassword } from './utils/validations';
import actions from '../../actions';
import { MaterialTextField } from '../../components/reduxFormFieldComponent/MaterialField';
import AuthFormPane from '../../components/AuthFormPane';
import rootUrls from '../../utils/rootUrl';

const loginSubmit = ({ username, password }) => axios.post(`${rootUrls}/auth/login`, { username, password }, { withCredentials: true })
  .then(
    res => res,
    (err) => {
      throw new SubmissionError({ [err.response.data.field]: err.response.data.message });
    }
  );

const userNameValidate = validUserName();
const passwordValidate = validPassword();

const LoginForm = (props) => {
  const {
    displayLoginForm, submitting, pristine,
    handleSubmit, toggleLoginForm
  } = props;
  if (displayLoginForm) {
    return (
      <AuthFormPane toggleLoginForm={toggleLoginForm}>
        <form className="login-form">
          <div>
            <Field
              name="username"
              label="账号/Email："
              component={MaterialTextField}
              validate={[required, userNameValidate]}
            />
          </div>
          <div>
            <Field
              name="password"
              label="密码："
              component={MaterialTextField}
              type="password"
              validate={[required, passwordValidate]}
            />
          </div>
          <div>
            {submitting ? <CircularProgress />
            :
            <RaisedButton
              backgroundColor="#2196f3"
              style={{ margin: '10px 0', color: '#fff', width: '180px' }}
              type="submit"
              disabled={pristine || submitting}
              onClick={handleSubmit(loginSubmit, props, true)}
            >
            登 录
            </RaisedButton>}
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
  ...propTypes
};

const mapStateToProps = (state) => {
  const {
    auth: { isLogged, refreshAuthentication },
    ui: { app: { popwindow: { displayLoginForm } } }
  } = state;

  return {
    isLogged,
    refreshAuthentication,
    displayLoginForm
  };
};

const {
  toggleLoginForm, toggleRegisterForm, refreshAuthentication
} = actions;
export default reduxForm({
  form: 'loginForm',
  enableReinitialize: true,
  onSubmitSuccess: (result, dispatch) => {
    dispatch(refreshAuthentication());
    dispatch(toggleLoginForm(false));
  }
})(connect(mapStateToProps, {
  toggleLoginForm,
  toggleRegisterForm
})(LoginForm));
