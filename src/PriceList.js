import React, { Component } from 'react';
import * as firebase from 'firebase';
import ReactDataGrid from 'react-data-grid';
import Button from 'react-button';
const ObjectAssign = require('object-assign');
import FaSave from 'react-icons/lib/fa/floppy-o';
import FaMail from 'react-icons/lib/fa/envelope-o';

const columnWidth = 200;

class PriceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cols: [
        {
          key: 'product',
          name: '↓Product/Area→',
          resizable: true,
          width: 400,
          locked: true,
        }
      ],
      rows: []
    };
  }

  componentDidMount() {
    const areasRef = firebase.database().ref().child('areas');
    const productsRef = firebase.database().ref().child('products/rice');


    let rowObj = {};

    //COLUMNS
    // Whats the source of truth for areas and products? PriceList Node or
    // individual products and areas
    areasRef.on('value', snap => {
      const areasArray = snap.val();
      let cols = ObjectAssign([],this.state.cols);
      Object.keys(areasArray).forEach( areayKey => {
        const area = areasArray[areayKey];
        cols.push({
          key: area.areaId + 'Agent',
          name: area.displayName + ' Agent',
          editable: true,
          width: columnWidth,
          resizable: true
        });
        rowObj[area.areaId + 'Agent'] = '0.00';
        cols.push({
          key: area.areaId + 'Outlet',
          name: area.displayName + ' Outlet',
          editable: true,
          width: columnWidth,
          resizable: true
        });
        rowObj[area.areaId + 'Outlet'] = '0.00';
      });

      this.setState({
        cols: cols
      });
    });

    productsRef.on('value', snap => {
      const productsArray = snap.val();
      let rows = [];
      Object.keys(productsArray).forEach( productKey => {
        const newRow = {
          product: productKey,
          ...rowObj
        };
        rows.push(newRow);
      });

      this.setState({
        rows: rows
      });
    });


  }

  rowGetter(i) {
    return this.state.rows[i];
  }

  handleGridRowsUpdated({ fromRow, toRow, updated, cellKey }) {
    let rows = this.state.rows.slice();

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = ObjectAssign({}, rowToUpdate, { ...updated });
      rows[i] = updatedRow;
    }
    this.setState({ rows });
  }

  getSize() {
    if(this.state && this.state.rows) {
      return this.state.rows.size;
    } else {
      return 0;
    }
  }

  updatePrices() {
    console.log("UPDATING PRICES");
  }

  sendSMS() {
    console.log("SENDING SMSes");
  }


  render() {
    const theme = {
        pressedStyle: {background: 'dark-blue', fontWeight: 'bold', fontSize: 32},
        overPressedStyle: {background: 'dark-blue', fontWeight: 'bold', fontSize: 32}
    };

    console.log('ROWS: '+ JSON.stringify(this.state.cols, null, 2));

    return <div>
      <p>Double click on the price to change</p>
      <ReactDataGrid
        enableCellSelect={true}
        columns={this.state.cols}
        rowGetter={this.rowGetter.bind(this)}
        rowsCount={this.state.rows.length}
        onGridRowsUpdated={this.handleGridRowsUpdated.bind(this)} />
      <Button className="update-button" onClick={ this.updatePrices.bind(this) } theme={ theme } disabled={ false }><FaSave />SAVE</Button>
      <Button className="sms-button" onClick={ this.sendSMS.bind(this) } theme={ theme } disabled={ false }><FaMail />SEND SMS</Button>
    </div>

  }
}

export default PriceList;

// COLUMN DATA SAMPLE
// {
//   key: 'WG_Town',
//   name: 'WG Town',
//   width: columnWidth,
//   editable: true,
//   resizable: true
// }


// ROW DATA SAMPLE
// {
//   product: '25KgLalithaYellow',
//   vizag_city: '343.00',
//   vizag_rural: '453.00',
//   vizag_gajuwaka: '563.00',
//   vizag_anakapalli: '783.00',
//   EG_city: '123.00',
//   EG_Peddapuram: '223.00',
//   EG_Agency: '633.00',
//   WG_Town: '843.00'
// }
