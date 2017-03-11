import React, { Component } from 'react';
import * as firebase from 'firebase';
import AlertContainer from 'react-alert';
import { Button } from 'react-bootstrap';
import FaSave from 'react-icons/lib/fa/floppy-o';

class AddArea extends Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      areaId: this.props.areaId || '',
      state: this.props.state || '',
      district: this.props.district || '',
      displayName: this.props.displayName || '',
      mode: this.props.mode || 'new'
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
      'district': this.state.district
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
            <Button className="save-button" bsStyle="primary" onClick={ this.saveArea.bind(this) } disabled={ !(this.state.areaId && this.state.displayName ) }> <FaSave />{ buttonText}</Button>
          </li>
        </ul>
      </div>
    );
  }

}

export default AddArea;
