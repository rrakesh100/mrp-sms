import React, {Component} from 'react';
import {connectProfile} from './auth';
import {Link} from 'react-router';
import './Home.css';
import FaLogin from 'react-icons/lib/fa/user-plus';

class Home extends Component {
  static propTypes = {
    ...connectProfile.PropTypes
  };

  render() {

    return (
      <div className="Home">
        <div className="Home-intro">
          { this.renderHomeContents() }
        </div>
      </div>
    );
  }

  renderHomeContents() {
    const {profile} = this.props;

    if (profile) {
      return (
        <div className="Site-profileControls">
          <p>Dashboards show up here </p>
        </div>
      );
    } else {
      return (
        <h4>Please <Link to="/login">Log In</Link> to manage your sales. Contact support@mrpsolutions.in for any issues! </h4>
      );
    }
  }
}

export default connectProfile(Home);
