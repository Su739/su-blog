import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { submit, reset } from 'redux-form';
import actions from '../actions';
import BlockedModal from '../components/BlockedModal';

const BlockedArticleDialog = (props) => {
  console.log(props);
  const {
    displayBlockedModal, toggleBlockedModal, resetForm,
    submitArticle, addArticle, removeArticle, blockedArticle
  } = props;
  return (
    <BlockedModal
      display={displayBlockedModal}
      closeModal={() => toggleBlockedModal(false)}
      okText="保存，并新建文章"
      refuseText="不保存，并新建文章"
      onOkClick={() => {
        const {
          id, depth, order, superior, title, content, parent, public: ispublic
        } = blockedArticle;
        submitArticle();
        removeArticle(-1);
        addArticle(id, depth, order, superior, title, content, parent, ispublic);
        toggleBlockedModal(false);
      }}
      onRefuseClick={() => {
        const {
          id, depth, order, superior, title, content, parent, public: ispublic
        } = blockedArticle;
        /*
        下面两个，虽然一顿操作猛如虎，但是editor不会重新加载，因为initialVlue没有变
        removeArticle(-1);
        addArticle(id, depth, order, superior, title, content, parent, ispublic);
        */
        // 此处应使用resetForm
        removeArticle(-1);
        addArticle(id, depth, order, superior, title, content, parent, ispublic);
        resetForm('editorForm');
        toggleBlockedModal(false);
      }}
      onCancelClick={() => toggleBlockedModal(false)}
    />
  );
};
BlockedArticleDialog.propTypes = {
  submitArticle: PropTypes.func,
  addArticle: PropTypes.func,
  removeArticle: PropTypes.func,
  blockedArticle: PropTypes.objectOf(PropTypes.any),
  displayBlockedModal: PropTypes.bool,
  toggleBlockedModal: PropTypes.func,
  resetForm: PropTypes.func
};

const mapStateToProps = (state) => {
  const {
    editingData: { newArticle, blockedArticle },
    ui: { popwindow: { displayBlockedModal } }
  } = state;

  return {
    newArticle,
    blockedArticle,
    displayBlockedModal
  };
};

const {
  addArticle, removeArticle, toggleBlockedModal
} = actions;
const submitArticle = () => submit('editorForm');

export default withRouter(connect(mapStateToProps, {
  addArticle, removeArticle, toggleBlockedModal, submitArticle, resetForm: reset
})(BlockedArticleDialog));
