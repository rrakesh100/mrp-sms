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
import AddAllowedArea from './AddAllowedArea';
import {Link} from 'react-router';


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
      renderOrdersTable: false,
      renderAreasTable: false,
      expandedRows : [],
      addShop: false,
      showModal: false,
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
              <Table.Cell>{item.proprietorName}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>MOBILE</Table.Cell>
              <Table.Cell>{item.mobile}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>TIN</Table.Cell>
              <Table.Cell>{item.tin}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>GST</Table.Cell>
              <Table.Cell>{item.gst}</Table.Cell>
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
              <Table.Cell>Address</Table.Cell>
              <Table.Cell>{item.address}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>STREET</Table.Cell>
              <Table.Cell>{item.street}</Table.Cell>
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
              <Table.Cell>STATE</Table.Cell>
              <Table.Cell>{item.state}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      )
    }

  renderItem(item) {
       return (
         <Collapse  key={"row-expanded-" + item.mobile}>
           <Panel header={item.name}>
               {this.renderExpandedData(item)}
           </Panel>
         </Collapse>
       );
   }

   renderOrderItem(item) {
        return (
            <div style={{height:40, backgroundColor:'#E6E6FF', marginTop:10}}>
                <div style={{color:'#16A085', fontSize:16, marginLeft:20, marginTop:'auto', marginBottom:'auto'}}>
                  <Link to={`/order/${item}`}>{item}</Link>
                </div>
            </div>
        );
    }

    renderAreaItem(item) {
         return (
             <div style={{height:40, backgroundColor:'#E6E6FF', marginTop:10}}>
                 <div style={{color:'#16A085', fontSize:16, marginLeft:20, marginTop:'auto', marginBottom:'auto'}}>
                   {item}
                 </div>
             </div>
         );
     }

     closeModal = () => {
       this.setState({
         showModal:false
       })
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
           <Modal
           trigger={<Button color='teal' style={{marginTop:10,marginLeft:10}}>Add Shop</Button>}
           centered={false}>
            <Modal.Header>Add Shop</Modal.Header>
            <Modal.Content>
              <AddShop userId={this.props.params.userId}/>
            </Modal.Content>
          </Modal>
          <div>{allItemRows}</div>
        </div>
        );
  }

  renderOrders() {
    const {userData}=this.state;
    let allItemRows = [];
       userData.orders && userData.orders.reverse().forEach(item => {
         const perItemRows = this.renderOrderItem(item);
           allItemRows = allItemRows.concat(perItemRows);
       });

       return (
         <div>
			     <div>{allItemRows}</div>
        </div>
      );
  }

  renderAreas() {
    const {userData}=this.state;
    let allItemRows = [];
    userData.allowedAreas && userData.allowedAreas.forEach(item => {
      const perItemRows = this.renderAreaItem(item);
        allItemRows = allItemRows.concat(perItemRows);
    });
    return (
      <div>
      <Modal onClose={this.closeModal} open={this.state.showModal}
      trigger={<Button color='teal' style={{marginTop:10,marginLeft:10}}
      onClick={() => this.setState({showModal:true})}>Add Area</Button>}
      centered={false}>
       <Modal.Content>
         <AddAllowedArea
          userId={this.props.params.userId}
          closeModal={this.closeModal}
          existingAreas={userData.allowedAreas}
          />
       </Modal.Content>
      </Modal>
      <div>{allItemRows}</div>
      </div>
    )
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
            <div className="sectionHeader" onClick={() => this.setState({renderShopsTable:!this.state.renderShopsTable})}>
              <h3>SHOPS</h3>
            </div>
            <div className="sectionBody">
            {this.state.renderShopsTable ? this.renderShops() : null}
            </div>
          </div>
          <div className="outlets">
            <div className="sectionHeader" onClick={() => this.setState({renderOrdersTable:!this.state.renderOrdersTable})}>
              <h3>ORDERS</h3>
            </div>
            <div className="sectionBody">
            {this.state.renderOrdersTable ? this.renderOrders() : null}
            </div>
          </div>
          <div className="outlets">
            <div className="sectionHeader" onClick={() => this.setState({renderAreasTable:!this.state.renderAreasTable})}>
              <h3>ALLOWED AREAS</h3>
            </div>
            <div className="sectionBody">
            {this.state.renderAreasTable ? this.renderAreas() : null}
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
