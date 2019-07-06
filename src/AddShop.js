import React, { Component } from 'react';
import * as firebase from 'firebase';
import AlertContainer from 'react-alert';
import { Button } from 'semantic-ui-react';
import FaSave from 'react-icons/lib/fa/floppy-o';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import AddDiscount from './AddDiscount';


class AddShop extends Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      userId: this.props.userId,
      mode: this.props.mode || 'new',
      name: this.props.name || '',
      proprietorName: this.props.proprietorName || '',
      mobile: this.props.mobile || '',
      pan: this.props.pan || '',
      taxType : this.props.taxType || '',
      shopNumber: this.props.shopNumber || '',
      street: this.props.street || '',
      cityName: this.props.cityName || '',
      area: this.props.area || '',
      pin: this.props.pin || '',
    };



    this.alertOptions = {
      offset: 20,
      position: 'top right',
      theme: 'light',
      time: 5000,
      transition: 'fade'
    };

    this.state = {
      ...this.defaultState
    };
  }


  saveShop() {
    const newShopData = {
      'name': this.state.name,
      'proprietorName': this.state.proprietorName,
      'mobile': this.state.mobile,
      'pan': this.state.pan,
      'taxType' : this.state.taxType,
      'shopNumber': this.state.shopNumber,
      'street': this.state.street,
      'cityName': this.state.cityName,
      'area': this.state.area,
      'pin': this.state.pin,
    };

    let shopRef;
    const shopsRefPath = `users/${this.state.userId}`;
    if(this.state.mode === 'edit') {
      console.log("UPDATING shop " + this.state.userId );
      shopRef = firebase.database().ref().child(shopsRefPath);

    } else {
      console.log("SAVING shop " + this.state.userId);
      shopRef = firebase.database().ref().child(shopsRefPath);
    }

    console.log(shopRef);

    shopRef.set(newShopData, error => {
      if(error) {
        this.msg.error(<div className="error">Error while saving Area <h4>{ this.state.name }</h4>: { error.message }</div>, {
          time: 2000,
          type: 'error',
        });
      } else {
        this.msg.success( <div className="success"><h4>Shop { this.state.name }</h4> is Successfully Saved</div>, {
          time: 2000,
          type: 'success',
        });


        if(this.state.mode === 'edit') {
          this.props.onClose();
        } else {
          this.setState({
            ...this.defaultState
          });
        }
      }
    });
  }

  updateInputValue(field, event) {
    this.setState({
      [field]: event.target.value
    });
  }

  render() {
    console.log(this.state)
    let buttonText =  'ADD SHOP';
    let opts = {};
    if(this.state.mode === 'edit'){
      buttonText = 'UPDATE AREA';
      opts['disabled'] = 'disabled';
    }

    return (
      <div className="area" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <AlertContainer ref={ a => this.msg = a} {...this.alertOptions} />
      <div style={{display:'flex', flexDirection: 'row'}}>
        <ul>
          <li>
            <label>Name</label>
            <span>
              <input type="text"
                name="name"
                placeholder="Name"
                value={ this.state.name }
                onChange={ this.updateInputValue.bind(this,'name')}
                required>
              </input>
            </span>
          </li>
          <li>
            <label>Proprietor Name</label>
            <span>
              <input type="text"
                name="proprietorName"
                placeholder="Proprietor Name"
                value={ this.state.proprietorName }
                onChange={ this.updateInputValue.bind(this, 'proprietorName') }
                required >
              </input>
            </span>
          </li>
          <li>
            <label>Mobile</label>
            <span>
              <input type="number"
                name="district"
                placeholder="Mobile"
                value={ this.state.mobile }
                onChange={ this.updateInputValue.bind(this,'mobile') }
                required>
              </input>
            </span>
          </li>
          <li>
            <label>Pan</label>
            <span>
              <input type="text"
                name="pan"
                placeholder="Pan Number"
                value={ this.state.pan }
                onChange={ this.updateInputValue.bind(this,'pan') }
                required>
              </input>
            </span>
          </li>
          <li>
            <label>Tax Type</label>
            <span>
              <select value={ this.state.taxType } style={{width: '100%'}}
                onChange={this.updateInputValue.bind(this,'taxType')}>
                <option value="none">None</option>
                <option value="vat">VAT</option>
                <option value="cst">CST</option>
                <option value="gst">GST</option>
              </select>
            </span>
          </li>
          </ul>

          <ul>
          <li>
            <label>House/Door/Shop Number</label>
            <span>
              <input type="text"
                name="shopNumber"
                placeholder="Shop Number"
                value={ this.state.shopNumber }
                onChange={ this.updateInputValue.bind(this,'shopNumber') }
                required>
              </input>
            </span>
          </li>
            <li>
              <label>Street Name</label>
              <span>
                <input type="text"
                  name="street"
                  placeholder="Street"
                  value={ this.state.street }
                  onChange={ this.updateInputValue.bind(this,'street')}
                  required>
                </input>
              </span>
            </li>
            <li>
              <label>City/Town/Village Name</label>
              <span>
                <input type="text"
                  name="cityName"
                  placeholder="City/Town/Village"
                  value={ this.state.cityName }
                  onChange={ this.updateInputValue.bind(this, 'cityName') }
                  required >
                </input>
              </span>
            </li>
            <li>
              <label>Select Area</label>
              <span>
                <select value={ this.state.area } style={{width: '100%'}}
                  onChange={this.updateInputValue.bind(this,'area')}>
                  <option value="noArea">No Area</option>
                  <option value="eastdt">EAST DT RURAL</option>
                  <option value="eastgodavari">EAST GODAVARI TOWNS</option>
                </select>
              </span>
            </li>
            <li>
              <label>Pin Code</label>
              <span>
                <input type="text"
                  name="pin"
                  placeholder="Pin Number"
                  value={ this.state.pin }
                  onChange={ this.updateInputValue.bind(this,'pin') }
                  required>
                </input>
              </span>
            </li>
            </ul>
          </div>
          <div style={{alignItems:'center', justifyContent:'center'}}>
            <Button className="save-button" bsStyle="primary" onClick={ this.saveShop.bind(this) } >{ buttonText}</Button>
          </div>

      </div>
    );
  }

}

export default AddShop;
