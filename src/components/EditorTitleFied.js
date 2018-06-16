import React from 'react';
import PropTypes from 'prop-types';
import './EditorTitleField.css';

const EditorTitleField = (props) => {
  const {
    input, label, id, name, ...custom
  } = props;
  return (
    <input
      className="input-title"
      name={name}
      id={id}
      {...input}
      {...custom}
    />
  );
};

EditorTitleField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  input: PropTypes.objectOf(PropTypes.any),
  label: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string
  })
};

export default EditorTitleField;
