import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Button } from 'react-bootstrap';
import AlertContainer from 'react-alert';
import { Card, CardTitle, CardText, CardHeader } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';


const statusColorMap = {
  'internal': 'primary',
  'onhold': 'warning',
  'cancelled': 'danger',
  'dispatched': 'success'
}


class OrderUpdate extends Component {

  constructor(props) {
    super(props);
    this.defaultState = {
      updateMsg: '',
      msgType: ''
    };
    this.state = {
      ...this.defaultState
    };
    this.alertOptions = {
      offset: 20,
      position: 'top right',
      theme: 'light',
      time: 5000,
      transition: 'fade'
    };
  }

  componentDidMount() {
    const updatesPath = `orderUpdates/${this.props.orderId}`;
    const updatesRef = firebase.database().ref().child(updatesPath);
    const updateArray = [];
    updatesRef.orderByChild('timestamp').on('value', snap => {
      const updates = snap.val();
      Object.keys(updates).forEach (updateKey =>{
        updateArray.push(updates[updateKey]);
      });
      this.setState({
        updates:updateArray
      });
    });

  }


  saveUpdate() {
    const orderUpdatePath = `orderUpdates/${this.props.orderId}`;
    const orderUpdateRef = firebase.database().ref().child(orderUpdatePath).push();
    const newUpdateData = {
      'updateMsg': this.state.updateMsg,
      'msgType': this.state.msgType,
      'timestamp': new Date().getTime(),
    };
    orderUpdateRef.set(newUpdateData, error => {
      if(error) {
        this.msg.error(<div className="error">Error while updating order <h4>{ this.props.orderId }</h4>: { error.message }</div>, {
          time: 2000,
          type: 'error',
        });
      } else {
        this.msg.success( <div className="success"><h4>{ this.props.orderId }</h4> is Successfully updated!</div>, {
          time: 2000,
          type: 'success',
        });
      }
      this.setState({
          ...this.defaultState,

      });

    });
  }

  updateInputValue(field, event) {
    console.log(field + " changed to " + event.target.value);
    this.setState({
      [field]: event.target.value
    });
  }

  renderUpdateCards() {
    let updateCards = [];

    if(this.state.updates && this.state.updates.length) {
      this.state.updates.forEach(update => {
        const time = new Date(update.timestamp).toString();
        const color = statusColorMap[update.msgType];
        console.log(update.msgType);
        updateCards.push(
          <div className="card">
            <CardHeader>{time}</CardHeader>
            <Card block inverse color={color}>
              <CardTitle>{update.msgType}</CardTitle>
              <CardText>{update.updateMsg}</CardText>
            </Card>
          </div>
        );
      });
    }
    return updateCards;
  }

  render() {

    return (
      <div>
        <AlertContainer ref={ a => this.msg = a} {...this.alertOptions} />

        <div className="orderUpdate">
          <span>
            <select value={ this.state.msgType } name="msgTypeSelector"
              onChange={this.updateInputValue.bind(this,'msgType')}>
              <option value="internal">MSG TYPE: INTERNAL</option>
              <option value="onhold">STATUS: ON HOLD</option>
              <option value="cancelled">STATUS: CANCELLED</option>
              <option value="dispatched">STATUS: DISPATCHED</option>
            </select>
          </span>
          <textarea name="update"
            placeholder="update message"
            value={ this.state.updateMsg }
            onChange={ this.updateInputValue.bind(this,'updateMsg') }>
          </textarea>
          <Button className="save-button" bsStyle="primary" onClick={ this.saveUpdate.bind(this) } disabled={ !(this.state.updateMsg) }>UPDATE</Button>
        </div>
        <div className="updates">
          { this.renderUpdateCards() }
        </div>
      </div>

    );

  }

}

export default OrderUpdate;
