import React, { Component } from 'react';
import * as firebase from 'firebase';
import AlertContainer from 'react-alert';
import { Button, Comment, Form, Header, Dropdown } from 'semantic-ui-react';
import Auth, { connectProfile, userInfo } from './auth';
import { Card } from 'semantic-ui-react';
import './OrderUpdate.css';


const statusColorMap = {
  'public': 'blue',
  'internal': 'black',
  'onhold': 'orange',
  'cancelled': 'red',
  'dispatched': 'green'
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
    const { nickname, name } = userInfo();

    const update = {
      'updateMsg': this.state.updateMsg,
      'msgType': msgType,
      'timestamp': new Date().getTime(),
      'name': name,
      'nickname': nickname
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
    this.setState({
      [field]: event.target.value
    });
  }

  renderUpdateCards(updates) {
    let updateCards = [];
    const { nickname, name } = userInfo();


    if(updates && updates.length) {
      updates.forEach(update => {
        const date = new Date(update.timestamp);
        const timeString  =  date.toDateString() + ' - ' + date.toLocaleTimeString();
        const color = statusColorMap[update.msgType];
        const textStyle = {
          color: color
        };
        updateCards.push(
          <Card color={ color }>
            <Card.Content>
              <Card.Header>
                { `${update.nickname}(${update.name})` }
              </Card.Header>
              <Card.Meta>
                { update.msgType }
              </Card.Meta>
              <Card.Description style={ textStyle }>
                { update.updateMsg }
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              { timeString }
            </Card.Content>
          </Card>
        );
      });
    }
    return updateCards;
  }

  saveMsgType(event, data) {
    this.setState({
      msgType: data.value
    });
  }

  saveMsg(event, data) {
    this.setState({
      updateMsg: data.value
    });
  }

  render() {

    const updates = this.state.updates;
    const updateTypes = [
      {
        key: 'internal',
        value: 'internal',
        text: 'INTERNAL UPDATE'
      },
      {
        key: 'public',
        value: 'public',
        text: 'PUBLIC UPDATE'
      },
      {
        key: 'onhold',
        value: 'onhold',
        text: 'STATUS: ON HOLD'
      },
      {
        key: 'cancelled',
        value: 'cancelled',
        text: 'STATUS: CANCELLED'
      },
      {
        key: 'dispatched',
        value: 'dispatched',
        text: 'STATUS: DISPATCHED'
      },
    ];

    return (
      <div className="updatesPanel">
        <AlertContainer ref={ a => this.msg = a} {...this.alertOptions} />
          <Comment.Group>
            { this.renderUpdateCards(updates) }

            <Form reply>
              <Form.TextArea onChange={ this.saveMsg.bind(this) }/>
              <Dropdown selection options={ updateTypes } defaultValue='internal' onChange={ this.saveMsgType.bind(this) } />
              <Button className="save-button" content='Update' labelPosition='left' icon='edit' primary onClick={ this.saveUpdate.bind(this) } />
            </Form>
        </Comment.Group>
      </div>

    );

  }

}

export default OrderUpdate;
