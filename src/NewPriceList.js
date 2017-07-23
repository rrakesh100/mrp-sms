import React, { Component } from 'react';
import * as firebase from 'firebase';
import ReactDataGrid from 'react-data-grid';
import ObjectAssign from 'object-assign';
import FaSave from 'react-icons/lib/fa/floppy-o';
import FaMail from 'react-icons/lib/fa/envelope-o';
import AlertContainer from 'react-alert';
import classnames from 'classnames';
import { Button, Menu } from 'semantic-ui-react'

const columnWidth = 140;

class NewPriceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeProductType: 'rice'
    };
  }

  render() {
  const { activeProductType } = this.state

    return <div className="priceList">
      <AlertContainer ref={ a => this.msg = a} {...this.alertOptions} />
      <Menu fluid widths={5}>
        <Menu.Item name='rice' active={ activeProductType === 'rice' } onClick={this.handleItemClick} />
        <Menu.Item name='ravva' active={ activeProductType === 'ravva' } onClick={this.handleItemClick} />
        <Menu.Item name='broken' active={ activeProductType === 'broken' } onClick={this.handleItemClick} />
      </Menu>
      <div className="table">
        <p><span style={ {color: '#ecf2f9' } }>██ </span> is agent price. <span style={ {color: '#fff7e6' } }>██ </span> is outlet price </p>
        <p>Double click on the price to change</p>
        { this.renderPriceListButtons() }
        { this.renderPriceListTable() }
        { this.renderPriceListButtons() }
      </div>

    </div>

  }

  renderPriceListButtons = () => <div>
    <Button className="update-button" onClick={ this.updatePrices.bind(this) } disabled={ false }><FaSave />SAVE</Button>
    <Button className="sms-button" onClick={ this.sendSMS.bind(this) } disabled={ false }><FaMail />SEND SMS</Button>
  </div>;


  renderPriceListTable() {
    return (<h1>PRICE LIST TABLE HERE</h1>);
  }

  handleItemClick = (e, { name }) => this.setState({ activeProductType: name });


  updatePrices() {
    //TODO
    // incorporate productType
    const archiveLocRef = firebase.database().ref().child('priceListArchive');
    const priceListRef = firebase.database().ref().child('priceList');
    //CHECK IF THERE ARE ANY CHANGES

    let currentPriceList = {};


    //SAVE CURRET PRICES
    priceListRef.once('value', snap => {
      currentPriceList = snap.val();
    });


    const rows = this.state.rows;
    const updatePriceList =  {};

    Object.keys(rows).forEach(productType => {
      const productRows = rows[productType];
      productRows.forEach(row => {
        const { key } = row;
        if(!( key in updatePriceList )) {
          updatePriceList[key] = {
            rice: {},
            ravva: {},
            broken: {}
          };
        }
        updatePriceList[key][productType] = this.rowToDbObject(row);
      });

    });
    console.log("UPDTED PRICE LIST: "+ JSON.stringify(updatePriceList, null, 2));

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
}

export default NewPriceList;
