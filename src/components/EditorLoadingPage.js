import React from 'react';
import './EditorLoadingPage.css';
import logo from './logo2.png';

const EditorLoadingPage = () => (
  <div className="white-mask">
    <div className="logo-wrapper">
      <img className="logo" src={logo} alt="logo" />
      <p className="loader">
        <span className="loader__dot">.</span>
        <span className="loader__dot">.</span>
        <span className="loader__dot">.</span>
      </p>
    </div>
  </div>
);

export default EditorLoadingPage;
