import React, { Component } from 'react';
import * as firebase from 'firebase';
import Spinner from 'react-spinkit';
import './Order.css';
import OrderUpdate from './OrderUpdate';
import { Table } from 'reactstrap';
import classNames from 'classnames';
import FaEyeClose from 'react-icons/lib/fa/eye-slash';
import FaEyeOpen from 'react-icons/lib/fa/eye';
import { Button } from 'semantic-ui-react'



const LOADING = 'loading';
const ERROR = 'error';

const statusColorMap = {
  'received': '#ccccff',
  'onhold': '#ffebcc',
  'completed': '#9fdf9f',
  'dispatched': '#9fdf9f',
  'cancelled': '#ffb399'
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
            let discount = item.quintalWeightPrice - item.discountedQuintalPrice;
            if(discount) {
              discount.toFixed(2);
            }
            let grossPrice = item.quintalWeightPrice*item.weight;
            counter++;
            rows.push(
              <tr>
                <th scope="row">{counter}</th>
                <td className="name">{item.name}</td>
                <td className="number">{item.weight}</td>
                <td className="number">{item.bags}</td>
                <td className="price">{grossPrice.toFixed(2)}</td>
                <td className="price">{discount}</td>
                <td className="price">{item.price.toFixed(2)}</td>
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
            <th>Quintals</th>
            <th>Bags</th>
            <th>Gross Price</th>
            <th>Discount/Qtl</th>
            <th>Net Price</th>
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
    const orderPath = `orders/${this.props.params.orderId}`;
    const orderRef = firebase.database().ref().child(orderPath);
    orderRef.on('value', snap => {
      const orderData = snap.val();
      if(orderData) {
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
    const { name, area, city, shopGrossAmount, totalWeight, items} = detail;
    const totalShopPriceNumber = +shopGrossAmount
    const totalShopPriceFixed = totalShopPriceNumber.toFixed(2);
    return (
      <div className="shop">
        <div className="details" key={area}>
          <h3>{name}, {city}</h3>
          { this.renderItems(items) }
          <h4><strong>{totalWeight}</strong> quintals for <strong>₹{totalShopPriceFixed}</strong></h4>
        </div>
      </div>
    );
  }


  renderSpecialMsg(msg) {
    return (
      <div className="splMsg">
        <p>{ msg }</p>
      </div>
    );
  }

  renderCart(cart) {
    const { discount_amount, totalPrice, grossPrice, shopDetail, selectedLorrySize, totalWeight } = cart;
    const shops = [];
    shopDetail.forEach( shop => {
      shops.push(this.renderShop(shop));
    })

    const totalPriceFixed = (+totalPrice).toFixed(2);
    const totalDiscount = (+discount_amount).toFixed(2);
    const totalWeightInTons = (+totalWeight)/10;
    let weightStatusColor = '#40bf80';
    if(totalWeightInTons > (+selectedLorrySize)) {
      weightStatusColor = '#ff3333';
    }


    return (
      <div className="cart" style={{textAlign: 'center'}}>
        { shops }
        <div className="summary">
          <h3>Total Price: <strong>₹{totalPriceFixed}</strong></h3>
          <h3>Total Discount: <strong>₹{totalDiscount}</strong></h3>
          <hr></hr>
          <h4>Total Order Weight: <strong>{totalWeightInTons}</strong> tons </h4>
          <h4>Selected Vehicle Capacity: <strong style={{color: weightStatusColor}}>{selectedLorrySize}</strong> tons </h4>
        </div>
      </div>
    );

  }

  toggleSidePanel() {
    this.setState({
      showUpdatePanel: !this.state.showUpdatePanel
    });
  }

  render() {

    if(this.state.orderData.loading === LOADING) {
      return <Spinner spinnerName="double-bounce" />
    }

    const { status, time, userName} = this.state.orderData;
    if(this.state.orderData.loading === ERROR) {
      return (
        <div>
          <div className="order">
            <div className="detail">
              <ul className="header" style={{backgroundColor: ' #ff6666', textAlign: 'center', listStyle: 'none' }}>
                <li><h1>{orderId}</h1></li>
                <li>Order <strong>{orderId}</strong> does not exist. Check URL again...</li>
              </ul>
            </div>
          </div>
        </div>

      );

      <h4>Order does not exist</h4>
    }
    const date = new Date(time);
    const orderStatusColor = statusColorMap[status];
    const orderId = this.props.params.orderId;

    const updateClasses = classNames({
      hide: this.state.showUpdatePanel !== true,
      update: true
    });

    const updateText  = this.state.showUpdatePanel ? <FaEyeClose onClick={ this.toggleSidePanel.bind(this) } /> :  <FaEyeOpen onClick={this.toggleSidePanel.bind(this)} />;
    const timeString  =  date.toDateString() + ' - ' + date.toLocaleTimeString();

    return (

      <div>
        <div className="order">
          <div className="detail">
            <div className="actionIcons">
              <Button.Group>
                <Button labelPosition='left' icon='left chevron' content='Previous Order' />
                <Button icon='edit' content='Updates' />
                <Button icon='print' content='Print' />
                <Button labelPosition='right' icon='right chevron' content='Next Order' />
              </Button.Group>
            </div>
            <ul className="header" style={{backgroundColor: orderStatusColor, textAlign: 'center', listStyle: 'none' }}>
              <li><h2>{orderId}</h2></li>
              <li><strong>{userName}</strong> ordered on <strong>{ timeString}</strong></li>
              <li>Order is <strong>{status}</strong></li>
              <li>{updateText}updates</li>
            </ul>
            { this.renderCart(this.state.orderData.cart) }
            { this.renderSpecialMsg(this.state.orderData.orderMsg) }
          </div>
          <div className={updateClasses}>
            <OrderUpdate orderId={orderId}/>
          </div>
        </div>
        <footer>© MRP Solutions 2017</footer>
      </div>
    );
  }
}

export default Order;
