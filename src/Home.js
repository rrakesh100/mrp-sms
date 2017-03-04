import React, {Component} from 'react';
import {connectProfile} from './auth';
import {Link} from 'react-router';
import './Home.css';

class Home extends Component {
  static propTypes = {
    ...connectProfile.PropTypes
  };

  render() {

    return (
      <div className="Home">
        <div className="Home-intro">
          <p>Please login to manage your sales. Contact support@mrpsolutions.in for any issues! </p>
        </div>
      </div>
    );
  }
}

export default connectProfile(Home);
