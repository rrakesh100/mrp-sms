import React, {Component} from 'react';
import {Router, Route, browserHistory} from 'react-router';
import {requireAuth} from './auth';
import Site from './Site';
import Home from './Home';
import Login from './Login';
import App from './App';
import Orders from './Orders';
import Order from './Order';
import NoMatch from './NoMatch';
import PriceList from './PriceList';
import Users from './Users';
import User from './User';

class Main extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route component={Site}>
          <Route path="/" component={ Home }/>
          <Route path="/login" component={ Login }/>
          <Route onEnter={requireAuth}>
            {/* Place all authenticated routes here */}
            <Route path="/console" component={ App }/>
            <Route path="/orders" component={ Orders }/>
            <Route path="/order/:orderId" component={ Order }/>
            <Route path="/users" component={ Users }/>
            <Route path="/user/:userId" component={ User }/>
          </Route>
        </Route>
        <Route path="*" component={ NoMatch }/>
      </Router>
    );
  }
}

export default Main;
