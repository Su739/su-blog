import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

const MaterialTextField = (props) => {
  const {
    input, label, meta: { touched, error }, ...custom
  } = props;
  return (
    <TextField
      hintText={label}
      floatingLabelText={label}
      errorText={touched && error}
      underlineDisabledStyle={{ color: 'none' }}
      {...input}
      {...custom}
    />
  );
};

MaterialTextField.propTypes = {
  input: PropTypes.objectOf(PropTypes.any),
  label: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string
  }),
  multiLine: PropTypes.bool
};

const MaterialToogleField = (props) => {
  const {
    input, label, ...custom
  } = props;
  return (
    <Toggle
      label={label}
      labelPosition="right"
      toggled={input.value || false}
      onToggle={input.onChange}
      {...input}
      {...custom}
    />
  );
};

MaterialToogleField.propTypes = {
  input: PropTypes.objectOf(PropTypes.any),
  label: PropTypes.string
};

export default {
  MaterialTextField,
  MaterialToogleField
};
