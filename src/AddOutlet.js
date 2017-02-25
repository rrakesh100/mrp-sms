import React, { Component } from 'react';
import Button from 'react-button';
import * as firebase from 'firebase';
import AlertContainer from 'react-alert';

class AddOutlet extends Component {
  constructor(props) {
    super(props);

    this.defaultState = {
      shopId: '',
      name: '',
      proprietor: '',
      mobile: '',
      mobile_alt: '',
      address: '',
      PAN: '',
      TAX_ID: '',
      agent_key: this.props.agentKey
    };

    this.state = {
      ...this.defaultState
    };
  }


  saveOutlet() {
    console.log("SAVING OUTLET!");
    //Check uniqueness of agent ID

    const outletsRefPath = `agents/${this.state.agent_key}/outlets`;
    console.log("OUTLET PATH: " + outletsRefPath);
    const outletRef = firebase.database().ref().child(outletsRefPath).push();
    const newOutletData = {
      'shopId': this.state.shopId,
      'name': this.state.name,
      'proprietor': this.state.proprietor,
      'mobile': this.state.mobile,
      'mobile_alt': this.state.mobile_alt,
      'address': this.state.address,
      'PAN': this.state.PAN,
      'TAX_ID': this.state.TAX_ID,
    };

    outletRef.set(newOutletData, error => {
      if(error) {
        this.msg.error(<div className="error">Error while saving Outlet <h4>{ this.state.name }</h4>: { error.message }</div>, {
          time: 2000,
          type: 'error',
        });
      } else {
        this.msg.success( <div className="success"><h4>Outlet { this.state.name }</h4> is Successfully Saved</div>, {
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
      <div className="add-product">
      <AlertContainer ref={ a => this.msg = a} {...this.alertOptions} />

        <ul>
          <li>
            <label>Shop ID</label>
            <span>
              <input type="text"
                name="shopId"
                placeholder="unique key to identify outlet"
                value={ this.state.shopId }
                onChange={ this.updateInputValue.bind(this,'shopId')}
                required >
              </input>
            </span>
          </li>

          <li>
            <label>Name</label>
            <span>
              <input type="text"
                name="name"
                placeholder="name of the shop"
                value={ this.state.name }
                onChange={ this.updateInputValue.bind(this,'name') }
                required>
              </input>
            </span>
          </li>
          <li>
            <label>Proprietor</label>
            <span>
              <input type="text"
                name="proprietor"
                placeholder="name of the shop owner"
                value={ this.state.proprietor }
                onChange={ this.updateInputValue.bind(this,'proprietor') }
                required>
              </input>
            </span>
          </li>
          <li>
            <label>mobile</label>
            <span>
              <input type="text"
                name="mobile"
                placeholder="+91 XXXXX XXXXX"
                value={ this.state.mobile }
                onChange={ this.updateInputValue.bind(this, 'mobile') }
                required>
              </input>
            </span>
          </li>
          <li>
            <label>Alternate Mobile</label>
            <span>
              <input type="text"
                name="mobile_alt"
                placeholder="+91 XXXXX XXXXX"
                value={ this.state.mobile_alt }
                onChange={ this.updateInputValue.bind(this, 'mobile_alt') }>
              </input>
            </span>
          </li>
          <li>
            <label>Address</label>
            <span>
              <input type="text"
                name="area"
                placeholder="address"
                value={ this.state.area }
                onChange={ this.updateInputValue.bind(this, 'area') }>
              </input>
            </span>
          </li>
          <li>
            <label>PAN</label>
            <span>
              <input type="text"
                name="PAN"
                placeholder="name of the shop"
                value={ this.state.PAN }
                onChange={ this.updateInputValue.bind(this,'PAN') }>
              </input>
            </span>
          </li>
          <li>
            <label>TAX ID</label>
            <span>
              <input type="text"
                name="PAN"
                placeholder="name of the shop"
                value={ this.state.TAX_ID }
                onChange={ this.updateInputValue.bind(this,'TAX_ID') }>
              </input>
            </span>
          </li>
          <li>
            <Button className="save-button" onClick={ this.saveOutlet.bind(this) } theme={ theme } disabled={ !(this.state.shopId && this.state.name && this.state.proprietor && this.state.mobile && this.state.PAN ) }>ADD OUTLET</Button>
          </li>
        </ul>

      </div>
    );
  }

}

AddOutlet.PropTypes = {
  agentKey: React.PropTypes.string.isRequired
};

export default AddOutlet;
