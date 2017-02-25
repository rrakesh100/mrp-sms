import React, { Component } from 'react';
import * as firebase from 'firebase';
import ReactDataGrid from 'react-data-grid';
import ObjectAssign from 'object-assign';
import Button from 'react-button';
import FaSave from 'react-icons/lib/fa/floppy-o';
import FaMail from 'react-icons/lib/fa/envelope-o';
import AlertContainer from 'react-alert';


const columnWidth = 100;

class PriceList extends Component {
  constructor(props) {
    super(props);

    this.alertOptions = {
      offset: 20,
      position: 'top center',
      theme: 'light',
      time: 5000,
      transition: 'fade'
    };

    this.state = {
      cols: [
        {
          key: 'area',
          name: '↓Area/Product→',
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

    //COLUMNS
    // Whats the source of truth for areas and products? PriceList Node or
    // individual products and areas
    productsRef.on('value', snap => {
      const productArray = snap.val();
      let cols = ObjectAssign([],this.state.cols);
      Object.keys(productArray).forEach( productKey => {
        const product = productArray[productKey];
        const productAgentKey = [productKey,'Agent'].join('$');
        const productOutletKey = [productKey,'Outlet'].join('$');

        cols.push({
          key: productAgentKey,
          name: product.name + ' Agent',
          editable: true,
          width: columnWidth,
          resizable: true
        });

        cols.push({
          key: productOutletKey,
          name: product.name + ' Outlet',
          editable: true,
          width: columnWidth,
          resizable: true
        });
      });

      this.setState({
        cols: cols
      });
    });

    areasRef.on('value', snap => {
      const areasArray = snap.val();
      let rows = [];
      Object.keys(areasArray).forEach( areaKey => {
        const area = areasArray[areaKey];
        const rowData = ObjectAssign({},this.props.rows[area.areaId]);
        const newRow = {
          area: area.displayName,
          key: area.areaId,
          ...rowData
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
    const archiveLocRef = firebase.database().ref().child('priceListArchive');
    const priceListRef = firebase.database().ref().child('priceList');
    //CHECK IF THERE ARE ANY CHANGES

    let currentPriceList = {};


    //SAVE CURRET PRICES
    priceListRef.once('value', snap => {
      currentPriceList = snap.val();
    });


    const rows = this.state.rows;
    const updatePriceList = {};
    rows.forEach(row => {
      let areaData = {};
      const { key, area } = row;
      updatePriceList[key] = this.rowToDbObject(row);
    });

    //NOT THE RIGHT COMPARISION, REVISIT LATER
    if(JSON.stringify(currentPriceList) === JSON.stringify(updatePriceList)) {
      this.msg.info(<div className="error">NO CHANGE</div>, {
        time: 2000,
        type: 'error',
      });

    } else {
      //Archive existing price list
      const date = new Date();
      const currentTime = date.getTime().toString();
      archiveLocRef.push({
        timestamp: currentTime,
        data: currentPriceList
      }, error => {
        if(error) {
          this.msg.error(<div className="error">Error while archiving old price list: { error.message }</div>, {
            time: 2000,
            type: 'error',
          });

        } else {
          this.msg.success( <div className="success">Old Price List is Successfully archived</div>, {
            time: 2000,
            type: 'success',
          });
        }
      });

      //save new price list
      priceListRef.set(updatePriceList, error => {
        if(error) {
          this.msg.error(<div className="error">Error while saving price list: { error.message }</div>, {
            time: 2000,
            type: 'error',
          });

        } else {
          this.msg.success( <div className="success">Price List is Successfully Saved</div>, {
            time: 2000,
            type: 'success',
          });
        }
      });

    }


  }

  sendSMS() {
    console.log("SENDING SMSes");
  }

  rowToDbObject(row) {
    console.log("ROW: "+ JSON.stringify(row, null, 2));
    let dbObject = {};
    if(row) {
      Object.keys(row).forEach( key => {
        const value = row[key];
        const [ product, priceType ] = key.split('$');
        if(priceType) {
          if(!dbObject[product]) {
            dbObject[product] = {};
          }
          dbObject[product][priceType] = value;
        }

      });
    }
    return dbObject;
  }

  dbObjectToRow() {
    console.log("DB OBJECT: "+ JSON.stringify(row, null, 2));
    let row = {};
    return row;
  }


  render() {
    const theme = {
        pressedStyle: {background: 'dark-blue', fontWeight: 'bold', fontSize: 32},
        overPressedStyle: {background: 'dark-blue', fontWeight: 'bold', fontSize: 32}
    };

    return <div>
      <AlertContainer ref={ a => this.msg = a} {...this.alertOptions} />
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
