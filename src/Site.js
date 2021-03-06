import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connectProfile, logout } from './auth';
import './Site.css';
import FaOrderList from 'react-icons/lib/fa/list';
import FaLogout from 'react-icons/lib/fa/user-times';
import FaLogin from 'react-icons/lib/fa/user-plus';
import FaSettings from 'react-icons/lib/fa/cogs';
import FaUsers from 'react-icons/lib/fa/group';
import FaMoney from 'react-icons/lib/fa/money';
import FaTags from 'react-icons/lib/fa/tag';


class Site extends Component {
  static propTypes = {
    ...connectProfile.PropTypes,
    children: PropTypes.any
  };

  render() {
    return (
      <div>
        <div className="Site one-edge-shadow">
          <div className="Site-header">
            <img src="./LalithaBrand.png" alt="Lalitha Industries" height="32"/>
          </div>
          { this.renderUserControls() }
        </div>
        <div className="Site-page">
          { this.props.children }
        </div>
      </div>

    );
  }

  renderUserControls() {
    const { access_token } = window.localStorage;

    if (access_token) {
        return (
          <div className="Site-profileControls">
            <div className="menu-item">
              <a onClick={() => logout()}><h4><FaLogout />Log Out</h4></a>
            </div>
            <div className="menu-item">
              <Link to="/dailyprices"><h4><FaTags />DailyPrices</h4></Link>
            </div>
            <div className="menu-item">
              <Link to="/dailyprice"><h4><FaTags />DailyPrices History</h4></Link>
            </div>
            <div className="menu-item">
              <Link to="/users"><h4><FaUsers />Users</h4></Link>
            </div>
            <div className="menu-item">
              <Link to="/orders"><h4><FaOrderList />Orders</h4></Link>
            </div>
            <div className="menu-item">
              <Link to="/console"><h4><FaSettings />Settings</h4></Link>
            </div>
          </div>
        );
      // } else {
      //   return (
      //     <div className="Site-profileControls">
      //       <div className="menu-item">
      //         <a onClick={() => logout()}><h4><FaLogout />Log Out</h4></a>
      //       </div>
      //       <div className="menu-item">
      //         <Link to="/orders"><h4><FaOrderList />Orders</h4></Link>
      //       </div>
      //     </div>
      //   );
      // }
    } else {
      return (
        <div className="Site-profileControls">
          <Link to="/login"><h4><FaLogin />Log In</h4></Link>
        </div>
      );
    }
  }
}

export default connectProfile(Site);
