import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import Reactable from 'reactable';
import 'react-tab-panel/index.css';
import Obj from 'object-assign';
import Button from 'react-button';
import ReactDataGrid from 'react-data-grid';
import ReactTabPanel, { ReactTabStrip } from 'react-tab-panel'
import 'react-tab-panel/index.css';
import Products from './Products';
import Agents from './Agents';
import Areas from './Areas';
import PriceList from './PriceList';


const PercentCompleteFormatter = React.createClass({
  propTypes: {
    value: React.PropTypes.number.isRequired
  },

  render() {
    const percentComplete = this.props.value;
    return (
      <div className="progress" style={{marginTop: '20px'}}>
        <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: percentComplete}}>
          {percentComplete}
        </div>
      </div>);
  }
});
const { Toolbar, Filters: { NumericFilter, AutoCompleteFilter }, Data: { Selectors } } = require('react-data-grid-addons');


class App extends Component {
  constructor(props) {
    super(props);

    const db = firebase.database();

    this.data = {
      dbRef: db.ref(),
      priceList: {
        rows: {}
      }
    }

    let _defaultRows = [];

    this._columns = [
      {
        key: 'orderId',
        name: 'ORDER ID',
        resizable: true,
        sortable: true,
        width: 200,
        filterable:true,
        filterRenderer: NumericFilter
      },
      {
        key: 'userName',
        name: 'CUSTOMER NAME',
        resizable: true,
        sortable: true,
        filterable:true
      },
      {
        key: 'state',
        name: 'STATE',
        resizable: true,
        sortable: true,
        filterable:true
      },
      {
        key: 'district',
        name: 'DISTRICT',
        resizable: true,
        sortable: true,
        filterable:true
      },
      {
        key: 'area',
        name: 'AREA',
        resizable: true,
        sortable: true,
        filterable:true
      },
      {
        key: 'city',
        name: 'CITY',
        resizable: true,
        sortable: true,
        filterable:true
      },
      {
        key: 'status',
        name: 'STATUS',
        resizable: true,
        sortable: true,
        filterable:true
      },
      {
        key: 'time',
        name: 'DATE',
        resizable: true,
        sortable: true,
        filterable:true
      }
    ];

    this.sampleData = {
      "1601150001" : {
        "agent" : "nanaji",
        "dispatched_timestamp" : "abcd",
        "district" : "vizag",
        "log" : {
          "1" : {
            "timestamp" : "1486290802",
            "msg_type" : "INTERNAL",
            "msg" : "Assigned Pradeep to expidite the delivery"
          },
          "2" : {
            "timestamp" : "1486290846",
            "msg_type" : "UPDATE",
            "msg" : "Packed required contents in Unit II"
          },
          "3" : {
            "timestamp" : "1486290898",
            "msg_type" : "UPDATE",
            "msg" : "Dispatched in AP37KN3456, driver contact number 9886317850"
          },
        },
        "recieved_timestamp" : "abc",
        "status" : "DISPATCHED",
        "weight_in_quintals" : 10
      },
      "1601150002" : {
        "agent" : "nanaji",
        "dispatched_timestamp" : "abcd",
        "district" : "vizag",
        "log" : {
          "1" : {
            "timestamp" : "1486290802",
            "msg_type" : "INTERNAL",
            "msg" : "Assigned Pradeep to expidite the delivery"
          },
          "2" : {
            "timestamp" : "1486290846",
            "msg_type" : "UPDATE",
            "msg" : "Packed required contents in Unit II"
          },
          "3" : {
            "timestamp" : "1486290898",
            "msg_type" : "UPDATE",
            "msg" : "Dispatched in AP37KN3456, driver contact number 9886317850"
          },
        },
        "recieved_timestamp" : "abc",
        "status" : "DISPATCHED",
        "weight_in_quintals" : 10
      }
    };

    this.defaultState = {
      name: '',
      lastUpdated: '',
      rows: _defaultRows,
      filters: {}
    };

    this.state = {
      ...this.defaultState
    };

  }

  handleTabSelect(index, last) {
    console.log('Selected tab: ' + index + ', Last tab: ' + last);
  }

  componentDidMount() {
    var that = this;
    const ordersRef = this.data.dbRef.child('orders');
    const priceListRef = this.data.dbRef.child('priceList');

    priceListRef.on('value', snap => {
      const priceList = snap.val();
      console.log("PRICE LIST: " + JSON.stringify(priceList, null, 2));

      Object.keys(priceList).forEach( areaId => {
        const areaData = priceList[areaId];
        let areaObj = {
          key: areaId
        };
        Object.keys(areaData).forEach( productId => {
          const { Agent, Outlet } = areaData[productId];
          const agentPriceKey = [ productId, 'Agent'].join('$');
          const outletPriceKey = [ productId, 'Outlet'].join('$');
          areaObj[agentPriceKey] = Agent;
          areaObj[outletPriceKey] = Outlet;
        });
        this.data.priceList.rows[areaId] = areaObj;
      });
      console.log("FORMED ROW DATA: " + JSON.stringify(this.data.priceList.rows, null,2));
    });

    ordersRef.once('value').then( snapshot => {
      let tablerows = [];let orders = snapshot.val();
      for(let key in orders){
        let order = orders[key];
        let dateTime = new Date(Number(order.time));
        let formattedDate =
          dateTime.getDate() + "/" +
          dateTime.getMonth() + 1 + "/" +
          dateTime.getFullYear() + " " +
          dateTime.getHours() + ":" +
          dateTime.getMinutes() + ":" +
          dateTime.getSeconds();

        tablerows.push( {
          orderId: Number(order.orderId),
          userName: order.userName,
          state:order.state,
          district:order.district,
          area:order.area,
          city: order.city,
          status:order.status,
          time : formattedDate
        })
      }
      that.setState({
         rows: tablerows
      })
    });

  }

  rowGetter(i) {
    return Selectors.getRows(this.state)[i];
  }

  rowsCount() {
   return Selectors.getRows(this.state).length;
  }

  handleFilterChange(filter) {
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({ filters: newFilters });
  }

  getValidFilterValues(columnId) {
   let values = this.state.rows.map(r => r[columnId]);
   return values.filter((item, i, a) => { return i === a.indexOf(item); });
  }

  handleOnClearFilters() {
    this.setState({filters: {} });
  }

  handleGridSort(sortColumn, sortDirection) {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    };

    const newRows = sortDirection === 'NONE' ? this.state.rows.slice(0) : this.state.rows.sort(comparer);
    this.setState({rows : newRows});
  }

  render() {

    const tabStyle = {
      mariginBottom: 20,
      minHeight: 600
    };

    return (
      <div className="App">
        <h1>Admin Console</h1>
        <p>Welcome Pradeep</p>
        <ReactTabPanel tabPosition="top" tabAlign="center" tabStyle={ tabStyle } className="ram-panel">

          <div tabTitle="Control Panel" className="control-panel">
            <ReactTabPanel tabPosition="left">
              <div tabTitle="Products" className="products">
                <Products />
              </div>

              <div tabTitle="Agents" className="agents">
                <Agents />
              </div>

              <div tabTitle="Outlets"  className="outlets">
                <h4>Add Outlet Details</h4>
              </div>

              <div tabTitle="Areas"  className="areas">
                <Areas />
              </div>

              <div tabTitle="User Config"  className="user-config">
                <h4>User Configuration Operations come here</h4>
              </div>

            </ReactTabPanel>
          </div>
          <div tabTitle="Price List" className="price-list">
            <PriceList rows={ this.data.priceList.rows }/>
          </div>

          <div tabTitle="Orders" className="order-list">
            <h4>All Active Orders and More</h4>
            <ReactDataGrid
              columns={this._columns}
              rowGetter={this.rowGetter.bind(this)}
              rowsCount={this.rowsCount()}
              onGridSort={this.handleGridSort.bind(this)}
              minHeight={500}
              toolbar={<Toolbar enableFilter={true}/>}
              onAddFilter={this.handleFilterChange.bind(this)}
              getValidFilterValues={this.getValidFilterValues}
              onClearFilters={this.handleOnClearFilters}
              />
          </div>
        </ReactTabPanel>
        <footer>© MRP Solutions 2017</footer>
      </div>
    );
  }

  loadItems() {
    const items = this.state.items || [];
    const { Tr, Td, Table, Thead, Th } = Reactable;
    const itemRecords = Object.keys(items).map(itemKey => {
      const item = items[itemKey];

      return <Tr id={ itemKey }>
        <Td column="name" data={ item.name } className="name"></Td>
        <Td column="price" data={ item.price } className="price"></Td>
      </Tr>
    });

    const inputRow = <Tr>
        <Td column="name">
          <input type="text" value={ this.data.newItem.name } onChange={ this.handleNewItem.bind(this, 'name') } />
        </Td>
        <Td column="price">
          <div>
            <input type="text" value={ this.data.newItem.price } onChange={ this.handleNewItem.bind(this, 'price') } />
            <Button onClick={ this.saveNewItem.bind(this) }>Save</Button>
          </div>
        </Td>
    </Tr>;

    return <Table className="centerTable" filterable={['name', 'price']}>
      <Thead>
          <Th column="name">
            <strong className="name-header">Name</strong>
          </Th>
          <Th column="price">
            <em className="age-header">Price</em>
          </Th>
      </Thead>
      { itemRecords }
      { inputRow }
    </Table>;
  }

  loadContacts() {
    const contacts = this.state.contacts || {};
    const { Tr, Td, Table, Thead, Th } = Reactable;
    const contactRecords = Object.keys(contacts).map( contactKey => {
      const contact = contacts[contactKey];

      return <Tr id={ contactKey }>
        <Td column="name" data={ contact.name } className="name"></Td>
        <Td column="mobile" data={ contact.mobile } className="mobile">
          <Button onClick={ this.saveNewContact.bind(this) } >Save</Button>
        </Td>
      </Tr>
    });

    const inputRow = <Tr>
        <Td column="name">
          <input type="text" value={ this.data.newContact.name } onChange={ this.handleNewContact.bind(this, 'name') } />
        </Td>
        <Td column="mobile">
          <div>
            <input type="text" value={ this.data.newContact.mobile } onChange={ this.handleNewContact.bind(this, 'mobile') } />
            <Button onClick={ this.saveNewContact.bind(this) } ><i class="fa fa-floppy-o" aria-hidden="true"></i></Button>
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
    newChildRef.set({
      name: this.data.newContact.name,
      mobile: this.data.newContact.mobile
    });
    this.data.newContact = {};
  }

  handleNewContact(field, event) {
    let currentContact = Object.assign({}, this.data.newContact,{
        [field]: event.target.value
      }
    );
    this.data['newContact'] = currentContact;
  }

  saveNewItem(event) {
    const newChildRef = this.data.dbRef.child('items').push();
    newChildRef.set({
      name: this.data.newItem.name,
      price: this.data.newItem.price
    });
    this.data.newItem = {};
  }

  handleNewItem(field, event) {
    let currentItem = Object.assign({}, this.data.newItem,{
        [field]: event.target.value
      }
    );
    this.data['newItem'] = currentItem;
  }

  loadTemplate() {
    return <div>{ this.state.template }</div>
  }
}
export default App;
