// src/Auth/Auth.js
import auth0 from 'auth0-js';
const LOGIN_ROUTE = '/login';
const ROOT_ROUTE = '/orders';
const CALLBACK_ROUTE = '/callback';

const NEXT_PATH_KEY = 'next_path';

import { browserHistory } from 'react-router';
import decode from 'jwt-decode';

const authZero = new auth0.WebAuth({
    domain: 'mrpsolutions.auth0.com',
    clientID: '7LVpFi0JPkfRCzqNoVpbG8Lvpkq9Fa6C',
    redirectUri: `${window.location.origin}${CALLBACK_ROUTE}`,
    audience: 'https://mrpsolutions.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid'
  });



export function  login() {
    authZero.authorize();
  }


export function  handleAuthentication() {
    authZero.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        setSession(authResult);
        browserHistory.push(ROOT_ROUTE);
      } else if (err) {
        browserHistory.push(ROOT_ROUTE);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

export function  setSession(authResult) {
   // Set the time that the access token will expire at
   let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
   localStorage.setItem('access_token', authResult.accessToken);
   localStorage.setItem('id_token', authResult.idToken);
   localStorage.setItem('expires_at', expiresAt);
   // navigate to the home route
   browserHistory.push(ROOT_ROUTE);
  }

export function  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    browserHistory.push(LOGIN_ROUTE);
  }

export function  isAuthenticated() {
   // Check whether the current time is past the
   // access token's expiry time
   let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
   return new Date().getTime() < expiresAt;
  }


  export function requireAuth(nextState, replace) {
    if (!isAuthenticated()) {
      setNextPath(nextState.location.pathname);
      replace({pathname: LOGIN_ROUTE});
    }
  }

  // function isLoggedIn() {
  //   const idToken = getIdToken();
  //   return idToken && !isTokenExpired(idToken);
  // }
  //
  // function getIdToken() {
  //   return localStorage.getItem(ID_TOKEN_KEY);
  // }
  //
  // function isTokenExpired(token) {
  //   const expirationDate = getTokenExpirationDate(token);
  //   return expirationDate < new Date();
  // }
  //
  // function getTokenExpirationDate(encodedToken) {
  //   const token = decode(encodedToken);
  //   if (!token.exp) { return null; }
  //
  //   const date = new Date(0);
  //   date.setUTCSeconds(token.exp);
  //
  //   return date;
  // }



export function  setNextPath(nextPath) {
    localStorage.setItem(NEXT_PATH_KEY, nextPath);
}
  //
  // function getNextPath() {
  //   return localStorage.getItem(NEXT_PATH_KEY) || ROOT_ROUTE;
  // }
  //
  // function clearNextPath() {
  //   localStorage.removeItem(NEXT_PATH_KEY);
  // }
