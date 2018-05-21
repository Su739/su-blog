import React from 'react';
import 'normalize.css';
import logo from './logo.svg';
import TrackEditor from './components/TrackEditor';
import CollapsePane from './components/CollapsePane';
import BookDetailForm from './components/BookDetailForm';
import './App.css';
import data from './data.json';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toEditBookId: null,
    }; // init state
    this.onContentChange = this.onContentChange.bind(this);
    this.loadContent = this.loadContent.bind(this); // 请求并加载文章
    this.getBookDetailById = this.getBookDetailById.bind(this); // 获得图书详情
    this.setEditBookId = this.setEditBookId.bind(this);
  }
  setEditBookId(id) {
    this.setState({ toEditBookId: id });
  }
  getBookDetailById(id) {
    const result = this.state.bookList.filter(book => book.bookId === id);
    if (result.length === 1) {
      return result[0];
    }
    throw new Error('怎么可以没有这个id或者多项匹配这个id');
  }
  componentWillMount() {
    // todo fetch data
    this.setState(data);
  }
  loadContent(id, type) {
    // todo fetch data by id
    /* if (type === 'chapter') {

    } else if (type === 'article') {

    } */
    this.setState({
      curArticle: {
        title: '# Wow loaded',
        content: '# Wow loaded',
      },
    });
  }
  onContentChange(e) {
    this.setState({
      curArticle: {
        content: e.target.value,
      },
    });
  }
  render() {
    const {
      isLoged,
      userName,
      bookList,
      curBook,
      curArticle: { title, content },
      toEditBookId,
    } = this.state;
    return (
      <div className="page-wrapper">
        <TrackEditor content={content} onContentChange={this.onContentChange} />
        <CollapsePane
          curBook={curBook}
          bookList={bookList}
          loadContent={this.loadContent}
          setEditBookId={this.setEditBookId}
        />
        {toEditBookId !== null ? (
          <BookDetailForm book={this.getBookDetailById(toEditBookId)} />
        ) : null}
      </div>
    );
  }
}

export default App;
