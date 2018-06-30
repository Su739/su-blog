import React from 'react';
import PropTypes from 'prop-types';

class UploadField extends React.Component {
  static propTypes = {
    input: PropTypes.objectOf(PropTypes.any),
    label: PropTypes.string,
    meta: PropTypes.objectOf(PropTypes.any)
  };
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { input: { onChange } } = this.props;
    onChange(e.target.files[0]);
  }

  render() {
    const {
      input, label, required, meta: { touched, error }
    } = this.props; // whatever props you send to the component from redux-form Field
    return (
      <div>
        <label>{label}</label>
        <div>
          <input type="file" accept=".jpg, .png, .jpeg" onChange={this.onChange} />
          {touched && error && <span>{error}</span>}
        </div>
      </div>
    );
  }
}

export default UploadField;
