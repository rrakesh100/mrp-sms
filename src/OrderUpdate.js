import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Button } from 'react-bootstrap';
import AlertContainer from 'react-alert';
import { Card, CardTitle, CardText, CardHeader } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';

const statusColorMap = {
  'public': 'primary',
  'internal': 'info',
  'onhold': 'warning',
  'cancelled': 'danger',
  'dispatched': 'success'
}


class OrderUpdate extends Component {

  constructor(props) {
    super(props);
    this.defaultState = {
      updateMsg: '',
      msgType: 'internal',
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
    const updatesPath = `orders/${this.props.orderId}/updates`;
    const updatesRef = firebase.database().ref().child(updatesPath);
    updatesRef.on('value', snap => {
      let updateArray = [];
      const updates = snap.val();
      Object.keys(updates).forEach (updateKey =>{
        updateArray.push(updates[updateKey]);
      });
      this.setState({
        updates: updateArray
      });
    });

  }


  saveUpdate() {
    const msgType = this.state.msgType;
    const orderPath = `orders/${this.props.orderId}`;
    const orderUpdatesPath = `${orderPath}/updates`;
    const orderStatusPath = `${orderPath}/status`;
    const orderRef = firebase.database().ref().child(orderPath);
    const orderUpdatesRef = firebase.database().ref().child(orderUpdatesPath).push();
    const orderUpdateKey = orderUpdatesRef.getKey();
    const update = {
      'updateMsg': this.state.updateMsg,
      'msgType': msgType,
      'timestamp': new Date().getTime()
    };

    const newStatusUpdate = {};
    newStatusUpdate['updates/' + orderUpdateKey] = update;

    if(msgType !== 'internal' && msgType !== 'public') {
      newStatusUpdate['status'] = msgType;
    }


    orderRef.update(newStatusUpdate, error => {
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

  renderUpdateCards(updates) {
    let updateCards = [];

    if(updates && updates.length) {
      updates.forEach(update => {
        const date = new Date(update.timestamp);
        const timeString  =  date.toDateString() + ' - ' + date.toLocaleTimeString();
        const color = statusColorMap[update.msgType];
        console.log(update.msgType);
        updateCards.push(
          <div className="card">
            <CardHeader>{timeString}</CardHeader>
            <Card block inverse color={color}>
              <CardTitle>{update.updateMsg}</CardTitle>
              <CardText>{update.msgType}</CardText>
            </Card>
          </div>
        );
      });
    }
    return updateCards;
  }

  render() {

    const updates = this.state.updates;

    return (
      <div className="updatesPanel">
        <AlertContainer ref={ a => this.msg = a} {...this.alertOptions} />
        <div className="updates">
          <div className="cards">
            { this.renderUpdateCards(updates) }
          </div>
          <div className="orderUpdate">
            <span>
              <select value={ this.state.msgType } name="msgTypeSelector"
                onChange={this.updateInputValue.bind(this,'msgType')}>
                <option value="internal">INTERNAL UPDATE</option>
                <option value="public">PUBLIC UPDATE</option>
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
        </div>
      </div>

    );

  }

}

export default OrderUpdate;
