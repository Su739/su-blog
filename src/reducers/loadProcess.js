// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.
const loadProcess = ({ types, mapActionToKey }) => {
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('请确认action是一个api请求action，然后更正types');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('types内应为string类型');
  }
  if (typeof mapActionToKey !== 'function') {
    throw new Error('Expected mapActionToKey to be a function.');
  }

  const [requestType, successType, failureType] = types;

  const updateUI = (state = {
    isFetching: false,
    nextPageUrl: undefined,
    pageCount: 0,
    ids: []
  }, action) => {
    switch (action.type) {
      case requestType:
        return {
          ...state,
          isFetching: true
        };
      case successType:
        return {
          ...state,
          isFetching: false
        };
      case failureType:
        return {
          ...state,
          isFetching: false
        };
      default:
        return state;
    }
  };

  return (state = {}, action) => {
    // Update pagination by key
    const key = mapActionToKey(action);
    if (typeof key !== 'string') {
      throw new Error('Expected key to be a string.');
    }
    switch (action.type) {
      case requestType:
      case successType:
      case failureType:
        return {
          ...state,
          [key]: updateUI(state[key], action)
        };
      default:
        return state;
    }
  };
};

export default loadProcess;
