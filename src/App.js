import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import Reactable from 'reactable';
import TabPanel from 'react-tab-panel';
import 'react-tab-panel/index.css';
import 'object-assign';
import Button from 'react-button';

// import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
// import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';



class App extends Component {
  constructor(props) {
    super(props);

    const db = firebase.database();

    this.data = {
      dbRef: db.ref().child('testUser').child('groups').child('testGroupName'),
      newContact: {},
      newItem: {}
    }

    this.state = {
      name: '',
      lastUpdated: ''
    }
  }

  componentDidMount() {
    var that = this;
    const itemsRef = this.data.dbRef.child('items');
    const contactsRef = this.data.dbRef.child('contacts');


    this.data.dbRef.child('name').once('value').then( snapshot => {
      that.setState({
        name: snapshot.val()
      })
    });

    this.data.dbRef.child('lastUpdated').once('value').then( snapshot => {
      that.setState({
        lastUpdated: snapshot.val()
      })
    });

    this.data.dbRef.child('template').once('value').then( snapshot => {
      that.setState({
        template: snapshot.val()
      })
    });

    itemsRef.once('value').then(function(snapshot) {
      that.setState({
        items: snapshot.val()
      });
    });

    contactsRef.once('value').then(function(snapshot) {
      that.setState({
        contacts: snapshot.val()
      });
    });


    itemsRef.on('value', snap => {
      that.setState({
        items: snap.val()
      });
    });
    contactsRef.on('value', snap => {
      that.setState({
        contacts: snap.val()
      });
    });
  }

  render() {

    const tabStyle = (props) => {
      const baseStyle = {
        padding: 10
      }

      return Object.assign(
        baseStyle,
        !props.active ?
          { color: 'blue' }:
          { background: 'gray' }
      )
    }
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{ this.state.name }</h2>
          <p>{ this.state.lastUpdated }</p>
        </div>

        <TabPanel tabAlign="center" tabStyle={ tabStyle }>
          <div className="centerTable" tabTitle="Items"> { this.loadItems() } </div>
          <div className="centerTable" tabTitle="Contacts">{ this.loadContacts() }</div>
          <div className="centerTable" tabTitle="Template">{ this.loadTemplate() }</div>
        </TabPanel>
      </div>
    );
  }

  loadItems() {
    const items = this.state.items || [];
    const itemRecords = items.map( items => {
            return <Reactable.Tr>
              <Reactable.Td column="name" data={ items.name } className="name"></Reactable.Td>
              <Reactable.Td column="price" data={ items.price } className="price"></Reactable.Td>
            </Reactable.Tr>
          });
    return <Reactable.Table className="centerTable" filterable={['name', 'price']}>
      <Reactable.Thead>
          <Reactable.Th column="name">
            <strong className="name-header">Name</strong>
          </Reactable.Th>
          <Reactable.Th column="price">
            <em className="age-header">Price</em>
          </Reactable.Th>
      </Reactable.Thead>
      { itemRecords }
    </Reactable.Table>;
  }

  loadContacts() {
    const contacts = this.state.contacts || {};
    const { Tr, Td, Table, Thead, Th } = Reactable;
    const contactRecords = Object.keys(contacts).map( contactKey => {
      const contact = contacts[contactKey];

      return <Tr>
        <Td column="name" data={ contact.name } className="name"></Td>
        <Td column="mobile" data={ contact.mobile } className="mobile"></Td>
      </Tr>
    });

    const inputRow = <Tr>
        <Td column="name">
          <input type="text" value={ this.data.newContact.name } onChange={ this.handleNewContact.bind(this, 'name') } />
        </Td>
        <Td column="mobile">
          <div>
            <input type="text" value={ this.data.newContact.mobile } onChange={ this.handleNewContact.bind(this, 'mobile') } />
            <Button onClick={ this.saveNewContact.bind(this) } >Save</Button>
          </div>
        </Td>
    </Tr>;

    return <Table className="centerTable" filterable={['name', 'mobile']}>
      <Thead>
          <Th column="name">
            <strong className="name-header">Name</strong>
          </Th>
          <Th column="mobile">
            <em className="age-header">Mobile</em>
          </Th>
      </Thead>
      { contactRecords }
      { inputRow }

    </Table>;
  }

  saveNewContact(event) {
    const newChildRef = this.data.dbRef.child('contacts').push();
    window.console.log("newContact", this.data.newContact);
    // now it is appended at the end of data at the server
    newChildRef.set({
      name: this.data.newContact.name,
      mobile: this.data.newContact.mobile
    });

    this.data.newContact = {};
  }

  handleNewContact(field, event) {

    window.console.log("NEW CONTACT", field, event.target.value);
    let currentContact = Object.assign({}, this.data.newContact,{
        [field]: event.target.value
      }
    );

    this.data['newContact'] = currentContact;

  }

  loadTemplate() {
    return <div>{ this.state.template }</div>
  }
}
export default App;
