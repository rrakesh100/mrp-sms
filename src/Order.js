import React, { Component } from 'react';
import * as firebase from 'firebase';
import Spinner from 'react-spinkit';
import './Order.css';
import OrderUpdate from './OrderUpdate';
import { Table } from 'reactstrap';

const LOADING = 'loading';
const ERROR = 'error';

const statusColorMap = {
  'received': '#ccccff',
  'onhold': '#ffebcc',
  'completed': '#9fdf9f',
  'cancelled': '#ffb399'
}

class PriceFormatter extends Component {
  render() {
    const priceFloatString = this.props.value + '.00';
    return <div className="price" style={{ textAlign: 'right'}}>{ priceFloatString }</div>
  }
}

class RightAlignFormatter extends Component {
  render() {
    return <div style={{ textAlign: 'right'}}>{ this.props.value }</div>
  }
}


class Items extends Component {

  createRows() {
    let rows = [];
    const items = this.props.items;
    if(items){
      let counter = 0;
      Object.keys(items).forEach( productType => {
        const itemsObject = items[productType];
        if(itemsObject) {
          Object.keys(itemsObject).forEach( itemId => {
            const item = itemsObject[itemId];
            counter++;
            rows.push(
              <tr>
                <th scope="row">{counter}</th>
                <td className="name">{item.name}</td>
                <td>{item.weight}</td>
                <td>{item.bags}</td>
                <td className="price">{item.price.toFixed(2)}</td>
                <td className="price">{item.discount_price.toFixed(2)}</td>
            </tr>
            );
          })
        }
      })
    }
    return rows;
  }

  render() {
    return  (
      <Table size="bordered sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Weight</th>
            <th>Bags</th>
            <th>Price</th>
            <th>Discount Price</th>
          </tr>
        </thead>
        <tbody>
          { this.createRows() }
        </tbody>
        </Table>
    );
  }
}


class Order extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orderData: {
        loading: LOADING
      }
    };
  }

  componentDidMount() {
    const orderRef = firebase.database().ref().child('orders');
    orderRef.orderByChild('orderId').equalTo(this.props.params.orderId).on('value', snap => {
      const orderHash = snap.val();
      if(orderHash) {
        let orderData = {};
        Object.keys(orderHash).forEach(orderKey => {
          orderData = orderHash[orderKey];
        });
        this.setState({
          orderData
        });
      } else {
        this.setState({
          orderData: {
            loading: ERROR
          }
        });
      }
    });
  }


  renderItems(items) {
    return <Items items={items} />
  }

  renderShop(detail) {
    const { name, area, city, totalShopPrice, totalShopWeight, items} = detail;
    const totalShopPriceNumber = +totalShopPrice
    const totalShopPriceFixed = totalShopPriceNumber.toFixed(2);
    return (
      <div className="shop">
        <div className="details" key={area}>
          <h3>{name}, {city}</h3>
          { this.renderItems(items) }
          <h4><strong>{totalShopWeight}</strong> quintals for <strong>₹{totalShopPriceFixed}</strong></h4>
        </div>
      </div>
    );
  }


  renderCart(cart) {
    const { discountAmount, grossPrice, shopDetail } = cart;
    const shops = [];
    shopDetail.forEach( shop => {
      shops.push(this.renderShop(shop));
    })

    const totalPrice = (+grossPrice).toFixed(2);
    const totalDiscount = (+discountAmount).toFixed(2);

    return (
      <div className="cart" style={{textAlign: 'center'}}>
        { shops }
        <div className="summary">
          <h3>Total Discount: <strong>₹{totalPrice}</strong></h3>
          <h3>Total Price: <strong>₹{totalDiscount}</strong></h3>
        </div>
      </div>
    );

  }

  renderUpdates() {

  }

  render() {

    if(this.state.orderData.loading === LOADING) {
      return <Spinner spinnerName="double-bounce" />
    }

    const {orderId, status, time, userName} = this.state.orderData;
    if(orderId !== this.props.params.orderId) {
      return <h4>Order does not exist</h4>
    }
    const date = new Date(time);
    const orderStatusColor = statusColorMap[status]


    return (

      <div>
        <div className="order">
          <div className="detail">
            <ul className="header" style={{backgroundColor: orderStatusColor, textAlign: 'center', listStyle: 'none' }}>
              <li><h2>{orderId}</h2></li>
              <li><strong>{userName}</strong> ordered on <strong>{date.toString()}</strong></li>
              <li>Order is <strong>{status}</strong></li>
            </ul>
            { this.renderCart(this.state.orderData.cart) }
          </div>
          <div className="update">
            <OrderUpdate orderId={orderId}/>
            { this.renderUpdates() }
          </div>
        </div>
        <footer>© MRP Solutions 2017</footer>
      </div>
    );
  }
}

export default Order;
