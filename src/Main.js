import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { requireAuth } from './auth';
import Site from './Site';
import Home from './Home';
import Login from './Login';
import App from './App';
import Orders from './Orders';
import Order from './Order';
import NoMatch from './NoMatch';
import PriceList from './PriceList';
import NewPriceList from './NewPriceList';
import AreaDetails from './AreaDetails';

import Users from './Users';
import User from './User';
import Input from './Input';
import Print from './Print';
import OrderSheet from './OrderSheet';

class Main extends Component {
  render() {
    return (
      <Router history={ browserHistory }>
        <Route component={ Site }>
          <Route path="/" component={ Home }/>
          <Route path="/login" component={ Login }/>
          <Route onEnter={requireAuth}>
            {/* Place all authenticated routes here */}
            <Route path="/console" component={ App }/>
            <Route path="/prices" component={ NewPriceList }/>
            <Route path="/orders" component={ Orders }/>
            <Route path="/order/:orderId" component={ Order }/>
            <Route path="/areas/:areaId" component={ AreaDetails }/>
            <Route path="/users" component={ Users }/>
            <Route path="/user/:userId" component={ User }/>
            <Route path="/input" component={ Input }/>
          </Route>
        </Route>
        <Route component={ Print }>
          <Route onEnter={requireAuth}>
            <Route path="/print/:orderId" component={ OrderSheet }/>
          </Route>
        </Route>
        <Route path="*" component={ NoMatch }/>
      </Router>
    );
  }
}

export default Main;
