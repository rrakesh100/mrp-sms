import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import Reactable from 'reactable';
import 'react-tab-panel/index.css';
import Button from 'react-button';
import ReactDataGrid from 'react-data-grid';
import ReactTabPanel from 'react-tab-panel'
import 'react-tab-panel/index.css';
import Products from './Products';
import Agents from './Agents';
import Areas from './Areas';
import PriceList from './PriceList';


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
    const priceListRef = this.data.dbRef.child('priceList');

    priceListRef.on('value', snap => {
      const priceList = snap.val();
      //console.log("PRICE LIST: " + JSON.stringify(priceList, null, 2));

      Object.keys(priceList).forEach( areaId => {
        const areaData = priceList[areaId];
        let areaObj = {
          key: areaId
        };
        const areaRiceData = areaData['rice'];
        Object.keys(areaRiceData).forEach( productId => {
          const { Agent, Outlet } = areaRiceData[productId];
          const agentPriceKey = [ productId, 'Agent'].join('$');
          const outletPriceKey = [ productId, 'Outlet'].join('$');
          areaObj[agentPriceKey] = Agent;
          areaObj[outletPriceKey] = Outlet;
        });
        this.data.priceList.rows[areaId] = areaObj;
      });
      //console.log("FORMED ROW DATA: " + JSON.stringify(this.data.priceList.rows, null,2));
    });
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
        </ReactTabPanel>
        <footer>© MRP Solutions 2017</footer>
      </div>
    );
  }
}
export default App;
