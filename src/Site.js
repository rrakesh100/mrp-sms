import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {connectProfile, logout} from './auth';
import './Site.css';

class Site extends Component {
  static propTypes = {
    ...connectProfile.PropTypes,
    children: PropTypes.any
  };

  render() {
    return (
      <div>
        <div className="Site">
          <div className="Site-header">
            <h4>Lalitha Industries</h4>
          </div>
          {this.renderUserControls()}
        </div>
        <div className="Site-page">
          {this.props.children}
        </div>
      </div>

    );
  }

  renderUserControls() {
    const {profile} = this.props;

    if (profile) {
      return (
        <div className="Site-profileControls">
          <a onClick={() => logout()}><h4>Log Out</h4></a>
        </div>
      );
    } else {
      return (
        <div className="Site-profileControls">
          <Link to="/login"><h4>Log In</h4></Link>
        </div>
      );
    }
  }
}

export default connectProfile(Site);
