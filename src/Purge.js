import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Button } from 'semantic-ui-react';
import moment from 'moment';



let count = 0;


class Purge extends Component {


  componentDidMount() {
    const ordersRef = firebase.database().ref().child('orders');
    let count = 0;
    ordersRef.once('value', snapshot => {
      const orders = snapshot.val();
      Object.keys(orders).forEach( orderId => {
        const order = orders[orderId];
        const orderTime = order.time;
        const orderDate = moment(orderTime).format('DD-MM-YYYY');
        //console.log(`${count++} | ${orderDate} | ${orderId}`);
        if (moment(orderTime).isBefore(moment().subtract(2, 'months'))) {
          //console.log(orderId + ' is older than a month and is on ' + orderDate);
          const updates = {};
          updates[ `/oldOrders/${orderDate}/${orderId}`] = order;
          updates[`/orders/${orderId}`] = null;
          firebase.database().ref().update(updates)
          .catch(e => {
            console.log(`Unable to archive ${orderId}`, e);
          });
        }
      });
    });
  }



  render() {
    return  (
      <div>
        <Button primary onClick={ this.onClick.bind(this) }>CLICK TO PURGE OLDER ORDERS</Button>
      </div>
    );
  }

  onClick(e) {
    //console.log();
  }

}

export default Purge;
