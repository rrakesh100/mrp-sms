import React, { Component } from 'react';
import * as firebase from 'firebase';
import Spinner from 'react-spinkit';
import ReactDataGrid from 'react-data-grid';
import './Order.css';
import OrderUpdate from './OrderUpdate';

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

  constructor(props) {
    super(props);
    this.createRows();
    this._columns = [
      {key: 'name', name: 'name', resizable: true, width: 400},
      {key: 'price', name: 'price', formatter: PriceFormatter},
      {key: 'bags', name: 'bags', formatter: RightAlignFormatter},
      {key: 'weight', name: 'weight', formatter: RightAlignFormatter},
      {key: 'discount_price', name:' Discount Price',formatter: PriceFormatter}
    ];
  }

  createRows() {
    let rows = [];
    const items = this.props.items;
    if(items){
      Object.keys(items).forEach( productType => {
        const itemsObject = items[productType];
        if(itemsObject) {
          Object.keys(itemsObject).forEach( itemId => {
            const item = itemsObject[itemId];
            rows.push(item);
          })
        }
      })
    }
    this._rows = rows;
  }

  rowGetter(i) {
    return this._rows[i];
  }

  render() {
    return  (
      <ReactDataGrid
        columns={this._columns}
        rowGetter={this.rowGetter.bind(this)}
        rowsCount={this._rows.length}
      />
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
    const { name, area, city, totalShopPrice, totalShopWeight, items} = detail
    return (
      <div className="shop">
        <div className="details" key={area}>
          <h3>{name},{city} <span style={{float: 'right', marginRight: 20}}>
            <strong>{totalShopWeight}</strong> quintals for <strong>₹{totalShopPrice}.00</strong></span></h3>
          { this.renderItems(items) }
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

    return (
      <div className="cart" style={{textAlign: 'center'}}>
        { shops }
        <h3>Total Discount: <strong>₹{discountAmount}.00</strong></h3>
        <h3>Total Price: <strong>₹{grossPrice}.00</strong></h3>
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
            <ul style={{backgroundColor: orderStatusColor, textAlign: 'center', listStyle: 'none' }}>
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
