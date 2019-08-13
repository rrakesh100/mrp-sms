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
      name: this.props.editItem &&  this.props.editItem.name || '',
      proprietorName: this.props.editItem && this.props.editItem.proprietorName || '',
      mobile:this.props.editItem &&  this.props.editItem.mobile || '',
      pan :this.props.editItem &&  this.props.editItem.pan || '',
      tin :this.props.editItem &&  this.props.editItem.tin || '',
      gst :this.props.editItem &&  this.props.editItem.gst || '',
      taxType :this.props.editItem &&  this.props.editItem.taxType || '',
      shopNumber :this.props.editItem &&  this.props.editItem.shopNumber || '',
      street:this.props.editItem &&  this.props.editItem.street || '',
      cityName: this.props.editItem && this.props.editItem.city || '',
      area: this.props.editItem && this.props.editItem.areaId || '',
      pin: this.props.editItem &&  this.props.editItem.pin || '',
      allowedAreas : this.props.allowedAreas || [],
      index : this.props.index,
      areasObj : {}
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


  componentDidMount() {
    console.log('index = = = ', this.props.index);
    const areasPath = `areas`;
    const areasRef = firebase.database().ref().child(areasPath);
    areasRef.once('value', snap => {
      this.setState( {areasObj : snap.val()});
    })
  }


  saveShop() {
    let areaId = this.state.area;
    const newShopData = {
      'name': this.state.name,
      'proprietorName': this.state.proprietorName,
      'mobile': this.state.mobile,
      'pan': this.state.pan,
      'tin': this.state.tin,
      'gst': this.state.gst,
      'taxType' : this.state.gst ? 'GST' : 'TIN',
      'shopNumber': this.state.shopNumber,
      'street': this.state.street,
      'city': this.state.cityName,
      'areaId': this.state.area,
      'pin': this.state.pin,
      'areaName' :  this.state.areasObj[areaId].displayName,
      'district' :  this.state.areasObj[areaId].district,
      'state' :  this.state.areasObj[areaId].state,
      'address': this.state.shopNumber + " ; " +
          this.state.street + " ; " +
          this.state.areasObj[areaId].displayName + " ; " +
          this.state.areasObj[areaId].district + " ; " +
          this.state.cityName + " ; " +
          this.state.areasObj[areaId].state  + "; " +
          this.state.pin
    };



    let shopRef;

    let ref=this;
    let shopsRefPath = `users/${this.state.userId}/shops`;
    if(this.state.mode === 'edit') {
      shopRef = firebase.database().ref().child(shopsRefPath + '/'+ this.state.index);
       let promise = shopRef.update(newShopData);
       promise.then(() => {
         this.props.closeModal();
         this.msg.success( <div className="success"><h4>Shop { ref.state.name }</h4> is Successfully edited</div>, {
           time: 2000,
           type: 'success',
         });

       })

    }else {
      shopRef = firebase.database().ref().child(shopsRefPath);

      shopRef.transaction(function(shops){
                shops=shops||[];
                shops.push(newShopData);
                return shops;
      }, function(success) {

          ref.msg.success( <div className="success"><h4>Shop { ref.state.name }</h4> is Successfully Saved</div>, {
            time: 2000,
            type: 'success',
          });
          ref.props.closeModal();
        }
       );
    }




  }

  updateInputValue(field, event) {
    this.setState({
      [field]: event.target.value
    });
  }

  createOptions() {
    let allowedAreas = this.state.allowedAreas;
    let options = [];
    options.push(<option value="noArea">No Area</option>);
    allowedAreas.forEach(areaId => {
      if(this.state.areasObj[areaId])
      options.push(<option value={areaId}>{this.state.areasObj[areaId].displayName}</option>);

    })
    return options;
  }

  render() {
    let buttonText =  'ADD SHOP';
    let opts = {};
    if(this.state.mode === 'edit'){
      buttonText = 'UPDATE SHOP';
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
            <label>TIN</label>
            <span>
              <input type="text"
                name="tin"
                placeholder="Tin Number"
                value={ this.state.tin }
                onChange={ this.updateInputValue.bind(this,'tin') }
                required>
              </input>
            </span>
          </li>
          <li>
            <label>GST Number</label>
            <span>
              <input type="text"
                name="gst"
                placeholder="GST Number"
                value={ this.state.gst }
                onChange={ this.updateInputValue.bind(this,'gst') }>
              </input>
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
                  {this.createOptions()}
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
