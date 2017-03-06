import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';
import './index.css';
import * as firebase from 'firebase';
//TODO
// move to .env
var config = {
    apiKey: "AIzaSyD3C0GHIqn8g-CMATS60LDcoQotkqM3ex8",
    authDomain: "stage-db-b035c.firebaseapp.com",
    databaseURL: "https://stage-db-b035c.firebaseio.com",
    storageBucket: "stage-db-b035c.appspot.com",
    messagingSenderId: "950510485815"
  };

// var config = {
//   apiKey: "AIzaSyCFBpTX6MqN-w_vp6cjduKdyZY3lLR7ty8",
//   authDomain: "mrps-orderform.firebaseapp.com",
//   databaseURL: "https://mrps-orderform.firebaseio.com",
//   storageBucket: "mrps-orderform.appspot.com",
//   messagingSenderId: "742927862975"
// };

firebase.initializeApp(config);

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
