import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyCahflwnjHNsaYDi0adV2IF7PuJmue8HoM",
  authDomain: "mrpsms-c5251.firebaseapp.com",
  databaseURL: "https://mrpsms-c5251.firebaseio.com",
  storageBucket: "mrpsms-c5251.appspot.com",
  messagingSenderId: "370088829658"
};
firebase.initializeApp(config);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
