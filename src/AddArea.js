import React, { Component } from 'react';
import * as firebase from 'firebase';
import AlertContainer from 'react-alert';
import { Button } from 'react-bootstrap';
import FaSave from 'react-icons/lib/fa/floppy-o';

class AddArea extends Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      areaId: '',
      state: '',
      district: '',
      displayName: ''
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
    console.log("SAVING AREA!");

    const areasRefPath = `areas`;
    const areaRef = firebase.database().ref().child(areasRefPath).push();
    const newAreaData = {
      'areaId': this.state.areaId,
      'displayName': this.state.displayName,
      'state': this.state.state,
      'district': this.state.district
    };

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
        this.setState({
          ...this.defaultState
        });
      }
    });

  }

  updateInputValue(field, event) {
    console.log(field + " changed to " + event.target.value);
    this.setState({
      [field]: event.target.value
    });
  }

  render() {
    const theme = {
        disabledStyle: { background: '#e6f5ff'},
        pressedStyle: {background: 'dark-blue', fontWeight: 'bold'},
        overPressedStyle: {background: 'dark-blue', fontWeight: 'bold'}
    };

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
                required >
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
                required>
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
            <Button className="save-button" bsStyle="primary" onClick={ this.saveArea.bind(this) } theme={ theme } disabled={ !(this.state.areaId && this.state.displayName ) }> <FaSave />ADD AREA</Button>
          </li>
        </ul>
      </div>
    );
  }

}

export default AddArea;
