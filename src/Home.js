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
        <p>Please <Link to="/login"><h4><FaLogin />Log In</h4></Link> to manage your sales. Contact support@mrpsolutions.in for any issues! </p>
      );
    }
  }
}

export default connectProfile(Home);
