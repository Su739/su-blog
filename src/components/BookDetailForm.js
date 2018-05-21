import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { renderTextField } from './redux-fom-meterial_ui/formField';
import { validLength, isEmpty } from '../utils/stringValodator';
import './BookDetailForm.css';

const BookDetailForm = (props) => {
  const {
    name, bookId, description, bookCover, postDate, invalidName,
  } = props;
  return (
    <form>
      <div>
        <Field name="bookName" component={renderTextField} label="书名" />
      </div>
      <div>
        <Field
          name="description"
          componet={renderTextField}
          props={{ multiLine: true }}
          label="简介"
        />
      </div>
    </form>
  );
};

BookDetailForm.propTypes = {
  book: PropTypes.shape({
    name: PropTypes.string,
    bookId: PropTypes.number,
    description: PropTypes.string,
    bookCover: PropTypes.string,
    writer: PropTypes.string,
    postDate: PropTypes.number,
  }),
};

export default reduxForm({ form: 'bookDetail' })(BookDetailForm);
