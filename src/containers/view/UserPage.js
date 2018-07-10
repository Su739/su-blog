import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { Tabs, Tab } from 'material-ui/Tabs';
import BookDetailForm from '../form/BookDetailForm';
import Book, { AddBookButton } from '../../components/Book';
import Modal from '../../components/Modal';
import actions from '../../actions';
import Error404 from '../../components/Error404';
import rootUrl from '../../utils/rootUrl';
import './UserPage.css';

const deleteBookById = id =>
  axios.delete(`${rootUrl}/api/books/${id}`, { withCredentials: true });

const UserProfileProperty = ({ name, value }) => {
  if (value) {
    return (
      <p className="user-property">
        <span className="user-property-label">{name}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        {value}
      </p>
    );
  }
  return null;
};

UserProfileProperty.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string
};

class UserPage extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    requestError: PropTypes.objectOf(PropTypes.any),
    userBooks: PropTypes.arrayOf(PropTypes.object),
    loadUser: PropTypes.func,
    toggleBookDetailForm: PropTypes.func,
    addDeletingBooks: PropTypes.func,
    destroyDeletingBooks: PropTypes.func,
    deleteBookEntity: PropTypes.func,
    refreshAuthentication: PropTypes.func,
    deletingBooks: PropTypes.arrayOf(PropTypes.number),
    username: PropTypes.string,
    user: PropTypes.objectOf(PropTypes.any),
    loginName: PropTypes.string
  }
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'book',
      bookOnEditting: null,
      deleteBookWarning: false
    };
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
    this.executeDelete = this.executeDelete.bind(this);
  }
  componentDidMount() {
    // if (process.env.NODE_ENV === 'production') {
    this.props.refreshAuthentication();
    // }
    const { loadUser, username } = this.props;
    loadUser(username);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.username !== this.props.username) {
      this.props.loadUser(this.props.username);
    }
  }

  handleTabChange(value) {
    this.setState({
      tabValue: value
    });
  }

  handleEditClick(id) {
    this.props.toggleBookDetailForm(true);
    this.setState({
      bookOnEditting: id
    });
  }

  handleDeleteClick(id) {
    this.props.addDeletingBooks(id);
    this.setState({ deleteBookWarning: true });
  }

  cancelDelete() {
    this.props.destroyDeletingBooks();
    this.setState({ deleteBookWarning: false });
  }

  executeDelete() {
    const { deletingBooks } = this.props;
    return deleteBookById(deletingBooks[0]);
  }

  render() {
    const {
      loginName, user, isFetching, userBooks, username, requestError, toggleBookDetailForm,
      deleteBookEntity
    } = this.props;
    const bookList = userBooks ? userBooks.map(b =>
      (<Book
        key={b.id}
        id={parseInt(b.id, 10)}
        username={username}
        name={b.name}
        description={b.description}
        createdAt={b.createdAt}
        handleEditClick={this.handleEditClick}
        handleDeleteClick={this.handleDeleteClick}
        loginName={loginName}
      />)) : null;
    if (requestError) {
      return <Error404 statusCode={requestError.status} message={requestError.message} />;
    }
    if (!user || isFetching) {
      return <div>loading...</div>;
    }
    return (
      <div>
        <Modal
          maskClose
          closeCB={this.cancelDelete}
          display={this.state.deleteBookWarning}
          tips="确定要删除这本书么？"
          okText="确定"
          cancelText="取消"
          onOkClick={this.executeDelete}
          onCancelClick={this.cancelDelete}
          resolvedCB={res => deleteBookEntity(res.data.id, res.data.writer)}
        />
        <BookDetailForm bookid={this.state.bookOnEditting} />
        <div className="user-page">
          <div className="user-profile">
            <img className="user-avatar" src={`${rootUrl}/avatars/${user.UserProfile.avatar}`} alt="avatar" />
            <div className="user-profile-detail">
              <h3 className="user-name">{user.UserProfile.nickName}</h3>
              <UserProfileProperty name="性别:" value={user.UserProfile.gender} />
              <UserProfileProperty name="公司:" value={user.UserProfile.company} />
              <UserProfileProperty name="技能:" value={user.UserProfile.profession} />
            </div>
          </div>
          <div className="user-content">
            <Tabs value={this.state.tabValue} onChange={this.handleTabChange}>
              <Tab label="图书列表" value="book">
                <div className="book-list">
                  {bookList}
                  {loginName === username &&
                    <AddBookButton onClick={() => toggleBookDetailForm(true)} />}
                </div>
              </Tab>
              <Tab label="文章列表" value="article-list">
                <ul>
                articleList
                </ul>
              </Tab>
            </Tabs>
          </div>
          {}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { params: { username } } = ownProps.match;
  const {
    auth: { loginName },
    entities: { books, users },
    deletingData: { deletingBooks },
    ui: { userPage: { isFetching, displayBookDetailForm } },
    requestError
  } = state;

  const user = users[username];
  const userBooks = user && user.Books.map(b => books[b]);

  return {
    loginName,
    user,
    username,
    userBooks,
    requestError,
    isFetching,
    displayBookDetailForm,
    deletingBooks
  };
};

const {
  loadUser, toggleBookDetailForm, addDeletingBooks,
  destroyDeletingBooks, deleteBookEntity, refreshAuthentication
} = actions;

export default connect(mapStateToProps, {
  loadUser,
  toggleBookDetailForm,
  addDeletingBooks,
  destroyDeletingBooks,
  deleteBookEntity,
  refreshAuthentication
})(UserPage);
