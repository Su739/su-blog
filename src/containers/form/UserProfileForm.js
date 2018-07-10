import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import axios from 'axios';
import MenuItem from 'material-ui/MenuItem';
import actions from '../../actions';
import { MaterialTextField, MaterialSelectField } from '../../components/reduxFormFieldComponent/MaterialField';
// import UploadField from '../../components/reduxFormFieldComponent/UploadField';
import Modal from '../../components/Modal';
import rootUrl from '../../utils/rootUrl';

const UserProfileForm = (props) => {
  const { toggleUserProfileForm, displayUserProfileForm } = props;
  if (displayUserProfileForm) {
    return (
      <div>
        <Modal closeModal={() => toggleUserProfileForm(false)}>
          <form>
            <img className="user-avatar" src={`${rootUrl}/avatars/${user.UserProfile.avatar}`} alt="avatar" />
            <Field className="user-avatar-upload" name="avatar" component="input" type="file" />
            <div>
              <Field name="nickName" component={MaterialTextField} label="昵称" />
            </div>
            <div>
              <Field name="gender" component={MaterialSelectField} label="性别">
                <MenuItem value="男" primaryText="男" />
                <MenuItem value="女" primaryText="女" />
              </Field>
              <Field name="profession" component={MaterialTextField} label="技能" />
              <Field name="company" component={MaterialTextField} label="公司" />
            </div>
            <Field name="userId" component="input" type="hidden" />
          </form>
        </Modal>
      </div>
    );
  }
  return null;
};

UserProfileForm.propTypes = {
  toggleUserProfileForm: PropTypes.func,
  displayUserProfileForm: PropTypes.bool
};

const mapStateToProps = (state) => {
  const {
    ui: { userPage: { displayUserProfileForm } }
  } = state;

  return {
    displayUserProfileForm
  };
};

const { toggleUserProfileForm } = actions;

export default reduxForm({
  form: 'userProfile'
})(connect(mapStateToProps, { toggleUserProfileForm })(UserProfileForm));
