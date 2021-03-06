import React, { Component } from 'react';
import * as firebase from 'firebase';
import Items from './Items';
import './Order.css';
import OrderUpdate from './OrderUpdate';
import classNames from 'classnames';
import FaEyeClose from 'react-icons/lib/fa/eye-slash';
import FaEyeOpen from 'react-icons/lib/fa/eye';
import { Button, Modal, Header, Image, Divider, Table, Loader } from 'semantic-ui-react';
const LOADING = 'loading';
const ERROR = 'error';

const statusColorMap = {
  'received': '#ccccff',
  'onhold': '#ffebcc',
  'completed': '#9fdf9f',
  'dispatched': '#9fdf9f',
  'cancelled': '#ffb399'
}

class Order extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orderData: {
        loading: LOADING
      },
      open: false,
      isAgent: false
    };
  }

  show = (dimmer) => () => this.setState({ dimmer, open: true })
  close = () => this.setState({ open: false })

  componentDidMount() {
    const orderPath = `orders/${this.props.params.orderId}`;
    const orderRef = firebase.database().ref().child(orderPath);
    orderRef.on('value', snap => {
      const orderData = snap.val();
      if(orderData) {
        console.log(orderData);
        let path = 'users' + '/' + orderData.uid;
        console.log(path);
         const usersRef = firebase.database().ref().child(path)
         usersRef.once('value', data =>{
           let userData = data.val();
           if(userData.isAgent) {
             this.setState({
               isAgent : true
             })
           }
         })
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

    console.log(this.props);
  }


  renderItems(items) {
    return <Items items={items} />
  }

  renderShop(detail) {
    const { name, area, city, shopGrossAmount, totalWeight, items, areaId, tin, address} = detail;
    const totalShopPriceNumber = +shopGrossAmount
    const totalShopPriceFixed = totalShopPriceNumber.toFixed(2);
    return (
      <div className="shop" key={ name }>
        <div className="details" key={area}>
          <h3>{name}, <span className="area">{address}</span> GST:<span className="gst">{`  ${tin}`}</span></h3>
          { this.renderItems(items) }
          <h4><strong>{totalWeight}</strong> quintals for <strong>₹{parseFloat(totalShopPriceFixed).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></h4>
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
          <Divider />
          <table className="summary">
            <tr>
              <td className="key"><h3>Total Price<span>:</span></h3></td>
              <td className="value"><strong>₹{parseFloat(totalPriceFixed).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
            <tr>
              <td className="key"><h3>Total Discount<span>:</span></h3></td>
              <td className="value"><strong>₹{parseFloat(totalDiscount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
            <tr>
              <td className="key"><h3>Total Order Weight<span>:</span></h3></td>
              <td className="value"><strong>{totalWeightInTons}</strong> tons </td>
            </tr>
            <tr>
              <td className="key"><h3>Vehicle Capacity<span>:</span></h3></td>
              <td className="value"><strong style={{color: weightStatusColor}}>{selectedLorrySize}</strong> tons</td>
            </tr>
          </table>
          <Divider />
        </div>
      </div>
    );

  }

  render() {

   console.log('===', this.state);
    if(this.state.orderData.loading === LOADING) {
      return <Loader />
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

    const timeString  =  date.toDateString() + ' - ' + date.toLocaleTimeString();

    return (

      <div>
        <div className="order">
          <div className="detail">
            <div className="actionIcons">
              <Button.Group>
                <Button labelPosition='left' icon='left chevron' content='Previous Order' />
                <a href={ `/order/updates/${orderId}` } target="_blank">
                  <Button icon='edit' content='Updates' onClick={ this.show(true) }/>
                </a>
                <a href={ `/print/${orderId}` } target="_blank">
                  <Button icon='print' content='Print' />
                </a>
                <Button labelPosition='right' icon='right chevron' content='Next Order' />
              </Button.Group>
            </div>
            <ul className="header" style={{backgroundColor: orderStatusColor, textAlign: 'center', listStyle: 'none' }}>
              <li><h2>{orderId}</h2></li>
              <li><h2>User type = {this.state.isAgent ? 'AGENT' : 'OUTLET'}</h2></li>
              <li><strong>{userName}</strong> ordered on <strong>{ timeString}</strong></li>
              <li>Order is <strong>{status}</strong></li>
            </ul>
            { this.renderCart(this.state.orderData.cart) }
            { this.renderSpecialMsg(this.state.orderData.orderMsg) }
          </div>
        </div>
        <footer>© MRP Solutions 2017</footer>
      </div>
    );
  }

  showPrintPage() {


    return true;
  }

}

export default Order;
