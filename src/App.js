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
        rice: {
          rows: {}
        },
        ravva: {
          rows: {}
        },
        broken: {
          rows: {}
        }
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


  componentDidMount() {
    var that = this;
    const priceListRef = this.data.dbRef.child('priceList');

    priceListRef.on('value', snap => {
      const priceList = snap.val();

      Object.keys(priceList).forEach( areaId => {
        const areaData = priceList[areaId];

        Object.keys(areaData).forEach( productType => {
          const areaProductTypeData = areaData[productType];
          let areaObj = {
            key: areaId
          };
          Object.keys(areaProductTypeData).forEach( productId => {
            const { Agent, Outlet } = areaProductTypeData[productId];
            const agentPriceKey = [ productId, 'Agent'].join('$');
            const outletPriceKey = [ productId, 'Outlet'].join('$');
            areaObj[agentPriceKey] = Agent;
            areaObj[outletPriceKey] = Outlet;
          });
          this.data.priceList[productType].rows[areaId] = areaObj;
        });

      });
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
            <PriceList priceList={ this.data.priceList }/>
          </div>
        </ReactTabPanel>
        <footer>© MRP Solutions 2017</footer>
      </div>
    );
  }
}
export default App;
