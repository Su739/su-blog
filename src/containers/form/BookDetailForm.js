import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import { MaterialTextField, MaterialToogleField } from '../../components/reduxFormFieldComponent/MaterialField';
import actions from '../../actions';
import Modal from '../../components/Modal';
import rootUrl from '../../utils/rootUrl';

const bookSubmit = ({
  id, name, writerid, description, ispublic
}) =>
  axios.post(`${rootUrl}/api/books/book`, {
    id, name, writerid, description, ispublic
  }, { withCredentials: true });


const BookDetailForm = (props) => {
  const {
    handleSubmit, displayBookDetailForm, toggleBookDetailForm, submitting, pristine, dirty
  } = props;
  if (displayBookDetailForm) {
    return (
      <Modal title="编辑图书" closeModal={() => toggleBookDetailForm(false)}>
        <form>
          <div>
            <div>
              <Field
                name="name"
                component={MaterialTextField}
                label="名称"
              />
            </div>
            <div>
              <Field
                name="description"
                component={MaterialTextField}
                label="简介"
                multiLine
                rowsMax={3}
                fullWidth
              />
            </div>
            <div>
              <Field
                name="ispublic"
                component={MaterialToogleField}
                label="对所有人可见"
              />
            </div>
            <Field name="id" component="input" type="hidden" />
            <Field name="writerid" component="input" type="hidden" />
            <div>
              {submitting ? <CircularProgress style={{
                  margin: '10px auto', color: '#fff', width: '180px', display: 'block'
                }}
              />
              :
              <RaisedButton
                backgroundColor="#2196f3"
                style={{
                  margin: '10px auto', color: '#fff', width: '180px', display: 'block'
                }}
                type="submit"
                disabled={pristine || submitting || !dirty}
                onClick={handleSubmit(bookSubmit, props, true)}
              >
              保 存
              </RaisedButton>}
            </div>
          </div>
        </form>
      </Modal>
    );
  }
  return null;
};

BookDetailForm.propTypes = {
  handleSubmit: PropTypes.func,
  toggleBookDetailForm: PropTypes.func,
  displayBookDetailForm: PropTypes.bool,
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  dirty: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  const { bookid } = ownProps;
  const {
    entities: { books, users },
    ui: { popwindow: { displayBookDetailForm } },
    auth: { loginName }
  } = state;

  const writer = users[loginName];

  const book = bookid ? books[bookid] : { writerid: writer && writer.id };
  return {
    initialValues: book,
    displayBookDetailForm
  };
};

const { toggleBookDetailForm, loadBook } = actions;

export default connect(mapStateToProps, { toggleBookDetailForm })(reduxForm({
  form: 'bookDetailForm',
  enableReinitialize: true,
  onSubmitSuccess: (result, dispatch) => {
    console.log(result);
    if (Array.isArray(result)) {
      dispatch(loadBook(result.data[0].id), true);
    } else {
      dispatch(loadBook(result.data.id), true);
    }
    dispatch(toggleBookDetailForm(false));
  }
})(BookDetailForm));
