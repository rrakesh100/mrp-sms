import React, { Component } from 'react';
import * as firebase from 'firebase';
import AlertContainer from 'react-alert';
import { Button } from 'semantic-ui-react';
import FaSave from 'react-icons/lib/fa/floppy-o';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import AddDiscount from './AddDiscount';


class AddArea extends Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      areaId: this.props.areaId || '',
      state: this.props.state || '',
      district: this.props.district || '',
      displayName: this.props.displayName || '',
      mode: this.props.mode || 'new',
      lorries: this.props.lorries || [],
      discounts: this.props.discounts || {},
      priority: this.props.priority || 0,
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


  saveArea() {


    const newAreaData = {
      'areaId': this.state.areaId,
      'displayName': this.state.displayName,
      'state': this.state.state,
      'district': this.state.district,
      'lorries' : this.state.lorries,
      'discounts': this.state.discounts,
      priority: this.state.priority
    };

    let areaRef;
    const areasRefPath = `areas/${this.state.areaId}`;
    if(this.state.mode === 'edit') {
      console.log("UPDATING area " + this.state.areaId );
      areaRef = firebase.database().ref().child(areasRefPath);

    } else {
      console.log("SAVING area " + this.state.areaId);
      areaRef = firebase.database().ref().child(areasRefPath);
    }

    areaRef.set(newAreaData, error => {
      if(error) {
        this.msg.error(<div className="error">Error while saving Area <h4>{ this.state.displayName }</h4>: { error.message }</div>, {
          time: 2000,
          type: 'error',
        });
      } else {
        this.msg.success( <div className="success"><h4>Area { this.state.displayName }</h4> is Successfully Saved</div>, {
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
    console.log(field + " changed to " + event.target.value);
    this.setState({
      [field]: event.target.value
    });
  }

  updateLorryValues(lorries) {
    if(lorries && lorries.length) {
      lorries = lorries.sort((a, b) => a - b);
    }
    const sortedLorries =
    console.log(lorries + " changed to " + lorries);
    this.setState({
      ['lorries']: lorries
    });
  }

  onDiscountsChange(discountsData) {
    this.setState({
      discounts: discountsData
    });
  }

  render() {
    let buttonText =  'ADD AREA';
    let opts = {};
    if(this.state.mode === 'edit'){
      buttonText = 'UPDATE AREA';
      opts['disabled'] = 'disabled';
    }

    return (
      <div className="area">
      <AlertContainer ref={ a => this.msg = a} {...this.alertOptions} />

        <ul>
          <li>
            <label>Area ID</label>
            <span>
              <input type="text"
                name="areaId"
                placeholder="unique key to identify area"
                value={ this.state.areaId }
                onChange={ this.updateInputValue.bind(this,'areaId')}
                required { ...opts }>
              </input>
            </span>
          </li>
          <li>
            <label>Display Name</label>
            <span>
              <input type="text"
                name="displayName"
                placeholder="Display Name for this Area"
                value={ this.state.displayName }
                onChange={ this.updateInputValue.bind(this, 'displayName') }
                required >
              </input>
            </span>
          </li>
          <li>
            <label>District</label>
            <span>
              <input type="text"
                name="district"
                placeholder="District"
                value={ this.state.district }
                onChange={ this.updateInputValue.bind(this,'district') }
                required>
              </input>
            </span>
          </li>
          <li>
            <label>State</label>
            <span>
              <input type="text"
                name="state"
                placeholder="State/Union Territory ex: AP"
                value={ this.state.state }
                onChange={ this.updateInputValue.bind(this,'state') }
                required>
              </input>
            </span>
          </li>
          <li>
            <label>Transport Choices</label>
            <span>
              <CheckboxGroup
                name="lorries"
                value={this.state.lorries}
                onChange={this.updateLorryValues.bind(this)}>

                <label className="checkGroup"><Checkbox value="3"/>3 Ton</label>
                <label className="checkGroup"><Checkbox value="5"/>5 Ton</label>
                <label className="checkGroup"><Checkbox value="7"/>7 Ton</label>
                <label className="checkGroup"><Checkbox value="10"/>10 Ton</label>
                <label className="checkGroup"><Checkbox value="17"/>17 Ton</label>
                <label className="checkGroup"><Checkbox value="21"/>21 Ton</label>
              </CheckboxGroup>
            </span>
          </li>
          <li>
            <label>Discount</label>
            <span>
              <AddDiscount discounts={this.state.discounts} onChange={this.onDiscountsChange.bind(this)}/>
            </span>
          </li>
          <li>
            <label>Priority</label>
            <span>
              <input type="text"
                name="priority"
                placeholder="lower numbers appear first"
                value={ this.state.priority }
                onChange={ this.updateInputValue.bind(this,'priority') }
                required>
              </input>
            </span>
          </li>
          <li>
            <Button className="save-button" bsStyle="primary" onClick={ this.saveArea.bind(this) } disabled={ !(this.state.areaId && this.state.displayName ) }> <FaSave />{ buttonText}</Button>
          </li>
        </ul>
      </div>
    );
  }

}

export default AddArea;
