import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import loadUser from '../actions/loadUser';
import UserCard from '../components/UserCard';
import BookShelf from '../components/BookShelf';

const mapStateToProps = (state) => {
  const { loginName, entities: { users = {}, books = {} }, result } = state;

  const bKeys = Object.keys(books);
  const allBooks = bKeys.map(key => books[key]);
  const userBooks = allBooks.filter(book => book.writerId === users[result.user].id);

  return {
    loginName,
    user: users[result.user],
    userBooks,
    result
  };
};
class UserPage extends React.Component {
  static propTypes = {
    loginName: PropTypes.oneOfType([PropTypes.string, null]), // 登录的用户
    user: PropTypes.objectOf.isRequired, // 被访问的用户
    userBooks: PropTypes.objectOf.isRequired,
    result: PropTypes.objectOf(PropTypes.string)
  };
  componentDidMount() {
    loadUser(this.props.user.userName);
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.user || nextProps.user.userName !== this.props.user.userName) {
      loadUser(nextProps.user.userName);
    }
  }
  render() {
    const {
      loginName, user, userBooks, result
    } = this.props;
    return (
      <div>
        <UserCard loginName={loginName} {...user} />
        <BookShelf bookList={userBooks} />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, { loadUser })(UserPage));
