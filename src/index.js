import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyCFBpTX6MqN-w_vp6cjduKdyZY3lLR7ty8",
  authDomain: "mrps-orderform.firebaseapp.com",
  databaseURL: "https://mrps-orderform.firebaseio.com",
  storageBucket: "mrps-orderform.appspot.com",
  messagingSenderId: "742927862975"
};
firebase.initializeApp(config);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
