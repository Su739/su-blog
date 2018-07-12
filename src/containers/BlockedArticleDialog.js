import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { submit, reset } from 'redux-form';
import actions from '../actions';
import BlockedModal from '../components/BlockedModal';

const BlockedArticleDialog = (props) => {
  const {
    displayBlockedModal, toggleBlockedModal, resetForm,
    submitArticle, addArticle, removeArticle, blockedArticle, removeBlockedArticle
  } = props;
  return (
    <BlockedModal
      title="当前文章还没有保存，请选择下面操作："
      display={displayBlockedModal}
      closeModal={() => {
        removeBlockedArticle();
        toggleBlockedModal(false);
      }}
      okText="保存，并新建文章"
      refuseText="不保存，并新建文章"
      onOkClick={() => {
        submitArticle();
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
        removeBlockedArticle();
        resetForm('editorForm');
        toggleBlockedModal(false);
      }}
      onCancelClick={() => {
        removeBlockedArticle();
        toggleBlockedModal(false);
      }}
    />
  );
};
BlockedArticleDialog.propTypes = {
  submitArticle: PropTypes.func,
  addArticle: PropTypes.func,
  removeArticle: PropTypes.func,
  removeBlockedArticle: PropTypes.func,
  blockedArticle: PropTypes.objectOf(PropTypes.any),
  displayBlockedModal: PropTypes.bool,
  toggleBlockedModal: PropTypes.func,
  resetForm: PropTypes.func
};

const mapStateToProps = (state) => {
  const {
    editingData: { newArticle, blockedArticle },
    ui: { editorPage: { displayBlockedModal } }
  } = state;

  return {
    newArticle,
    blockedArticle,
    displayBlockedModal
  };
};

const {
  addArticle, removeArticle, toggleBlockedModal, removeBlockedArticle
} = actions;
const submitArticle = () => submit('editorForm');

export default withRouter(connect(mapStateToProps, {
  addArticle,
  removeArticle,
  toggleBlockedModal,
  submitArticle,
  resetForm: reset,
  removeBlockedArticle
})(BlockedArticleDialog));
