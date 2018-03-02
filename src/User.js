import React, { Component } from 'react';
import * as firebase from 'firebase';
import Spinner from 'react-spinkit';
import ObjectAssign from 'object-assign';
import { Table } from 'reactstrap';
import classNames from 'classnames';
import Collapse, { Panel } from 'rc-collapse-icon';
import FaUserDisable from 'react-icons/lib/fa/user-times';
import FaUserEnable from 'react-icons/lib/fa/user-plus';
import Outlet from './Outlet';
import AddOutlet from './AddOutlet';
import './User.css';



const LOADING = 'loading';
const ERROR = 'error';

const statusColorMap = {
  'AGENT': '#ccccff',
  'OUTLET': '#ffebcc',
  'ACTIVATED': '#9fdf9f',
  'DISABLED': '#ffb399'
}

class Items extends Component {

  createRows() {
    let rows = [];
    const items = this.props.items;
    if(items){
      let counter = 0;
      items.forEach( item => {
        if(item) {
            counter++;
            rows.push(
              <tr>
                <th scope="row">{counter}</th>
                <td>{item.name}</td>
                <td>{item.city}</td>
                <td>{item.proprietor_name}</td>
                <td>{item.mobile}</td>
                <td>{item.areaId}</td>
                <td>{item.tin}</td>
                <td>{item.pan}</td>
              </tr>
            );
        }
      })
    }
    return rows;
  }

  render() {
    return  (
      <Table size="bordered striped sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>City</th>
            <th>Owner</th>
            <th>Mobile</th>
            <th>Area</th>
            <th>TIN</th>
            <th>PAN</th>
          </tr>
        </thead>
        <tbody>
          { this.createRows() }
        </tbody>
        </Table>
    );
  }
}


class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: {
        loading: LOADING
      }
    };
  }

  componentDidMount() {
    const userPath = `users/${this.props.params.userId}`;
    const userRef = firebase.database().ref().child(userPath);
    userRef.on('value', snap => {
      const userData = snap.val();
      if(userData) {
        this.setState({
          userData
        });
      } else {
        this.setState({
          userData: {
            loading: ERROR
          }
        });
      }
    });
  }


  renderItems(items) {
    return <Items items={items} />
  }


  activateUserStatus(enable) {
    const userStatusPath = `users/${this.props.params.userId}/active`;
    const userStatusRef = firebase.database().ref().child(userStatusPath);
    userStatusRef.set(enable, error => {
      if(error) {
        console.log("ERROR: Unable to change user activity status");
      } else {
        let userData = ObjectAssign({}, this.state.userData, {
          active: enable
        });
        this.setState({
          userData: userData
        });
        console.log("SUCCESS: Successfully changed user activity status");
      }
    })
  }

  render() {

    if(this.state.userData.loading === LOADING) {
      return <Spinner spinnerName="double-bounce" />
    }

    const { active, mobile, name} = this.state.userData;
    const userStatus = active ? 'ACTIVATED' : 'DISABLED';

    if(this.state.userData.loading === ERROR) {
      return (
        <div>
          <div className="user">
            <ul style={{backgroundColor: ' #ff6666', textAlign: 'center', listStyle: 'none' }}>
              <li><h2>INVALID URL: User <strong>{userId}</strong> does not exist.</h2></li>
            </ul>
          </div>
        </div>

      );
      <h4>User does not exist</h4>
    }

    const userStatusColor = statusColorMap[userStatus];
    const userId = this.props.params.userId;
    const userActivityActionIcon  = active ? <h2><FaUserDisable onClick={ this.activateUserStatus.bind(this, false) }/> </h2>:  <h2><FaUserEnable onClick={this.activateUserStatus.bind(this, true)}/></h2>;
    const userActivityActionText = active ? 'Click Here to ↓ Disable User' : 'Click Here to ↓ Enable User';
    return (
      <div>
        <div className="userPage">
          <div className="user">
              <ul style={{backgroundColor: userStatusColor, textAlign: 'center', listStyle: 'none' }}>
                <li><h1>{ name }</h1></li>
                <li><h2>{ userId }</h2></li>
                <li>User is <strong>{ userStatus }</strong></li>
                <li>{ userActivityActionText } { userActivityActionIcon }</li>
              </ul>
          </div>
          <div className="outlets">
            <div className="sectionHeader">
              <h3>OUTLETS</h3>
            </div>
            <div className="sectionBody">
            </div>
          </div>
          <div className="outlets">
            <div className="sectionHeader">
              <h3>ORDERS</h3>
            </div>
            <div className="sectionBody">
            </div>
          </div>
        </div>
        <hr />
        <footer>© MRP Solutions 2017</footer>
      </div>
    );
  }
}

export default User;
