import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import IconButton from 'material-ui/IconButton';
import SwapHoriz from 'material-ui/svg-icons/action/swap-horiz';
import Help from 'material-ui/svg-icons/action/help';
import Image from 'material-ui/svg-icons/image/image';
import Save from 'material-ui/svg-icons/content/save';
import actions from '../../actions';
import CatalogContainer from '../CatalogContainer';
import EditorForm from '../EditorForm';
import EditorPreviewer from '../../components/EditorPreviewer';
import Error404 from '../../components/Error404';
import './EditorPage.css';

const ToolButton = props => (
  <IconButton
    iconStyle={{ width: '24px', height: '24px', padding: '0' }}
    tooltipPosition="top-right"
    tooltip={props.tooltip}
    hoveredStyle={{ backgroundColor: '#ddd' }}
    tooltipStyles={{ transition: 'none' }}
    style={{
      borderRadius: '4px', width: 'none', height: 'none', padding: '3px', margin: '6px 0'
    }}
    onClick={props.onClick}
  >
    {props.children}
  </IconButton>
);
ToolButton.propTypes = {
  children: PropTypes.node,
  tooltip: PropTypes.string,
  onClick: PropTypes.func
};

const EditorPage = (props) => {
  console.log(props);
  const {
    match, isLogged, isFetching, formValues, submitArticle, loadArticle
  } = props;
  if (isLogged) {
    return (
      <div className="editor-page">
        <CatalogContainer
          url={match.url}
          isEditor
          bookid={parseInt(match.params.bookid, 10)}
        />
        {isFetching
          ?
            <div style={{ marginTop: '100px' }}>loading3...</div>
          :
            <div className="editor-and-previewer">
              <div className="editor-container">
                <Switch>
                  <Route path="/:username/book/:bookid/~/edit/:articleid" component={EditorForm} />
                  <Route exact path="/:username/book/:bookid/~/edit" component={EditorForm} />
                  <Route path="/" component={Error404} />
                </Switch>
              </div>
              <div className="tool-wall">
                <div className="tool-box">
                  <div className="tool-box-top">
                    <ToolButton tooltip="交换窗口位置">
                      <SwapHoriz />
                    </ToolButton>
                    <ToolButton tooltip="上传图片">
                      <Image />
                    </ToolButton>
                    <ToolButton tooltip="语法提示">
                      <Help />
                    </ToolButton>
                  </div>
                  <div className="tool-box-bottom">
                    <ToolButton onClick={submitArticle} tooltip="保存提交">
                      <Save color="#007bff" />
                    </ToolButton>
                  </div>
                </div>
              </div>
              <div className="editor-previewer">
                <EditorPreviewer content={formValues ? formValues.content : 'loading...'} title={formValues ? formValues.title : ''} />
              </div>
            </div>
          }
      </div>
    );
  }
  return (<Redirect to={`/${match.params.username}`} />);
};

EditorPage.propTypes = {
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }),
  isLogged: PropTypes.bool,
  isFetching: PropTypes.bool,
  formValues: PropTypes.objectOf(PropTypes.any),
  submitArticle: PropTypes.func
};

const mapStateToProps = (state) => {
  const {
    auth: { isLogged, loginName },
    ui: { editor: { isFetching } },
    form
  } = state;
  const formValues = form && form.editorForm && form.editorForm.values;
  return {
    isLogged,
    isFetching,
    formValues
  };
};

const { loadArticle } = actions;
const submitArticle = () => submit('editorForm');

export default withRouter(connect(mapStateToProps, { loadArticle, submitArticle })(EditorPage));
