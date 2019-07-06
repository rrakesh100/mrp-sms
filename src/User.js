import React, { Component } from 'react';
import * as firebase from 'firebase';
import ObjectAssign from 'object-assign';
import { Table, Loader, Button, Checkbox, Icon,Header, Image, Modal} from 'semantic-ui-react';
import classNames from 'classnames';
import Collapse, { Panel } from 'rc-collapse-icon';
import FaUserDisable from 'react-icons/lib/fa/user-times';
import FaUserEnable from 'react-icons/lib/fa/user-plus';
import Outlet from './Outlet';
import AddOutlet from './AddOutlet';
import './User.css';
import Collapsible from 'react-collapsible';
import AddShop from './AddShop';


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
      },
      renderShopsTable: false,
      expandedRows : [],
      addShop: false
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

    renderExpandedData(item) {
      return (
        <Table size='large' striped>
    <Table.Body>
      <Table.Row>
        <Table.Cell>SHOP NAME</Table.Cell>
        <Table.Cell>{item.name}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>PROPRIETOR NAME</Table.Cell>
        <Table.Cell>{item.proprietor_name}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>AREA ID</Table.Cell>
        <Table.Cell>{item.areaId}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>AREA NAME</Table.Cell>
        <Table.Cell>{item.areaName}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>CITY</Table.Cell>
        <Table.Cell>{item.city}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>DISTRICT</Table.Cell>
        <Table.Cell>{item.district}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>TAX TYPE</Table.Cell>
        <Table.Cell>{item.taxType}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>MOBILE</Table.Cell>
        <Table.Cell>{item.mobile}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>STATE</Table.Cell>
        <Table.Cell>{item.state}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>TIN</Table.Cell>
        <Table.Cell>{item.tin}</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
      )
    }

  renderItem(item) {
       return (
         <Collapse  key={"row-expanded-" + item.id}>
           <Panel header={item.name}>
               {this.renderExpandedData(item)}
           </Panel>
         </Collapse>
       );
   }

  renderShops() {
    const {userData, renderShopsTable}=this.state;
    let allItemRows = [];

       userData.shops && userData.shops.forEach(item => {
           const perItemRows = this.renderItem(item);
           allItemRows = allItemRows.concat(perItemRows);
       });

       return (
         <div>
			     <div>{allItemRows}</div>
           {renderShopsTable &&
            <Modal trigger={<Button color='teal'>Add Shop</Button>} centered={false}>
             <Modal.Header>Add Shop</Modal.Header>
             <Modal.Content>
               <AddShop userId={this.props.params.userId} />
             </Modal.Content>
           </Modal>}
        </div>
        );
  }

  render() {

    if(this.state.userData.loading === LOADING) {
      return <Loader />
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
            <div className="sectionHeader" onClick={() => this.setState({renderShopsTable:true})}>
              <h3>SHOPS</h3>
            </div>
            <div className="sectionBody">
            {this.state.renderShopsTable ? this.renderShops() : null}
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
