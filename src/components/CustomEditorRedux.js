const CHANGE_CONTENT = 'CHANGE_CONTENT';
const LOAD_CONTENT_REQUEST = 'LOAD_CONTENT_REQUEST';
const LOAD_CONTENT_FAILURE = 'LOAD_CONTENT_FAILURE';
const LOAD_CONTENT_SUCCESS = 'LOAD_CONTENT_SUCCESS';

function changeContent(content) {
  return {
    type: CHANGE_CONTENT,
    payload: content,
    id,
  };
}

function loadContentRequest(content) {
  return {
    type: LOAD_CONTENT_REQUEST,
    payload: content,
  };
}

function loadContentSuccess(content) {
  return {
    type: LOAD_CONTENT_REQUEST,
    payload: content,
  };
}

function loadContentFailure(err) {
  return {
    type: LOAD_CONTENT_REQUEST,
    payload: err,
    err: true,
  };
}

// -------------reducers---------------


const article = (state={}, action) => {
  switch (action.type) {
    case CHANGE_CONTENT:
      return action.payload;
    default:
      return state;
  }
};
