import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import BookDetailForm from '../form/BookDetailForm';
import Book, { AddBookButton } from '../../components/Book';
import actions from '../../actions';
import Error404 from '../../components/Error404';
import rootUrl from '../../utils/rootUrl';
import './UserPage.css';

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
    username: PropTypes.string,
    user: PropTypes.objectOf(PropTypes.any),
    loginName: PropTypes.string
  }
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'book',
      bookOnEditting: null
    };
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }
  componentDidMount() {
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

  render() {
    const {
      loginName, user, isFetching, userBooks, username, requestError, toggleBookDetailForm
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
    ui: { userPage: { isFetching } },
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
    isFetching
  };
};

const { loadUser, toggleBookDetailForm } = actions;

export default connect(mapStateToProps, { loadUser, toggleBookDetailForm })(UserPage);
