import React, { useState, useContext } from 'react';
import '../../css/userauth.css';
import bgImg from '../../Ui_Images/login-bg.jpg'

const UserAuth = (props) => {

  return (

    <div className="login-container">
      <img src={bgImg} alt="Login screen" />
      <div className="login-sub-container">
        <div className="login-left">
          <h1>{props.form}</h1>
          {props.component}
        </div>

        <div className="login-right">
          <div className="login-right-content">
            <h1>Rasheed</h1>
            <h1>Stationers</h1>
          </div>
        </div>
      </div>

    </div>
  );
};

export default UserAuth;


