import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';

export const MaterialTextField = (props) => {
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

export const MaterialToogleField = (props) => {
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

export const MaterialSelectField = ({
  input, label, meta: { touched, error }, children, ...custom
}) => (
  <SelectField
    floatingLabelText={label}
    errorText={touched && error}
    onChange={(event, index, value) => input.onChange(value)}
    {...input}
    {...custom}
  >
    {children}
  </SelectField>
);

MaterialSelectField.propTypes = {
  input: PropTypes.objectOf(PropTypes.any),
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string
  }),
  children: PropTypes.node,
  label: PropTypes.string
};

export default {
  MaterialTextField,
  MaterialToogleField,
  MaterialSelectField
};
