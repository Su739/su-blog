import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import actions from '../actions';
import BlockedModal from '../components/BlockedModal';

const BlockedArticleDialog = (props) => {
  console.log(props);
  const {
    displayBlockedModal, toggleBlockedModal,
    submitArticle, addNewArticle, destroyBlockedArticle, blockedArticle
  } = props;
  return (
    <BlockedModal
      display={displayBlockedModal}
      closeModal={() => toggleBlockedModal(false)}
      okText="保存，并新建文章"
      refuseText="不保存，并新建文章"
      onOkClick={() => {
        submitArticle();
        addNewArticle(...blockedArticle);
        destroyBlockedArticle();
        toggleBlockedModal(false);
      }}
      onRefuseClick={() => {
        destroyBlockedArticle();
        toggleBlockedModal(false);
      }}
      onCancelClick={() => toggleBlockedModal(false)}
    />
  );
};
BlockedArticleDialog.propTypes = {
  submitArticle: PropTypes.func,
  addNewArticle: PropTypes.func,
  destroyBlockedArticle: PropTypes.func,
  blockedArticle: PropTypes.objectOf(PropTypes.any),
  displayBlockedModal: PropTypes.bool,
  toggleBlockedModal: PropTypes.func
};

const mapStateToProps = (state) => {
  const {
    tempData: { newArticle, blockedArticle },
    ui: { popwindow: { displayBlockedModal } }
  } = state;

  return {
    newArticle,
    blockedArticle,
    displayBlockedModal
  };
};

const {
  addNewArticle, destroyBlockedArticle, toggleBlockedModal
} = actions;
const submitArticle = () => submit('editorForm');

export default withRouter(connect(mapStateToProps, {
  addNewArticle, destroyBlockedArticle, toggleBlockedModal, submitArticle
})(BlockedArticleDialog));
