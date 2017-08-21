import React, { Component } from 'react';
import * as firebase from 'firebase';
import Spinner from 'react-spinkit';
import { Table } from 'reactstrap';
import Auth, { connectProfile, userInfo } from './auth';
import Items from './Items';
import './OrderSheet.css';

const LOADING = 'loading';
const ERROR = 'error';

class OrderSheet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orderData: {
        loading: LOADING
      }
    };
  }

  renderItems(items) {
    return <Items items={items} />
  }

  renderShop(detail) {
    const { name, area, city, shopGrossAmount, totalWeight, items, mobile, gst} = detail;
    const totalShopPriceNumber = +shopGrossAmount
    const totalShopPriceFixed = totalShopPriceNumber.toFixed(2);
    return (
      <div className="shop" key={ name }>
        <div className="details" key={area}>
          <h3>{ name }, { city } GST: { gst ? gst : '___________' }, 📱: { mobile }</h3>
          { this.renderItems(items) }
          <h4><strong>{totalWeight}</strong> quintals for <strong>₹{parseFloat(totalShopPriceFixed).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></h4>
        </div>
      </div>
    );
  }


  renderSpecialMsg(msg) {
    if(!msg) {
      return;
    }

    return (
      <div className="splMsg">
        <hr />
        <p>{ msg }</p>
      </div>
    );
  }

  getAbstractOrder() {
    const { discount_amount, totalPrice, grossPrice, shopDetail, selectedLorrySize, totalWeight } = this.state.orderData.cart;
    const abstractOrder = {};
    shopDetail.forEach( shop => {
      const { name, area, city, shopGrossAmount, totalWeight, items} = shop;
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
              const { name, weight, bags, price } = item;

              if(abstractOrder[itemId]) {
                const { weight:oldWeight, bags:oldBags, discount:oldDiscount, grossPrice:oldGrossPrice } = abstractOrder[itemId];
                const itemDetails = abstractOrder[itemId];
                itemDetails.weight = +oldWeight + +weight;
                itemDetails.bags = +oldBags + +bags;
                itemDetails.discount = +oldDiscount + +discount;
                itemDetails.grossPrice = +oldGrossPrice + +grossPrice;
              } else {
                abstractOrder[itemId] = {
                  name,
                  weight,
                  bags,
                  price: price.toFixed(2),
                  grossPrice: grossPrice.toFixed(2),
                  discount,
                };
              }
            });
          }
        });
      }
    });
    return abstractOrder;
  }

  renderAbstractOrderDetails() {
    const abstractOrder = this.getAbstractOrder();
    return (
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
          { this.getAbstractRows(abstractOrder) }
        </tbody>
        </Table>
    );
  }

  getAbstractRows(abstractOrder) {
    let counter = 1;
    const rows = [];
    let totalWeight = 0;
    let totalPrice = 0;
    let totalBags = 0;
    Object.keys(abstractOrder).map( itemId => {
      const { name, weight, bags, grossPrice, discount, price } = abstractOrder[itemId];
      totalWeight = (+totalWeight) + (+weight);
      totalPrice = (+totalPrice) + (+grossPrice);
      totalBags = (+totalBags) + (+bags);

      rows.push(
        <tr key={ counter }>
          <td scope="row">{ counter++ }</td>
          <td className="name">{ name }</td>
          <td className="number">{ weight }</td>
          <td className="number">{ bags }</td>
          <td className="price">{ parseFloat(grossPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td className="price">{ discount }</td>
          <td className="price">{ parseFloat(price).toLocaleString('en-IN', { minimumFractionDigits: 2 }) }</td>
        </tr>
      );

    });
    console.log(`TOTAL WEIGHT= ${totalWeight}, TOTAL PRICE= ${totalPrice}`);

    rows.push(
      <tr key={ counter } className="total">
        <td scope="row"></td>
        <td className="name">TOTAL</td>
        <td className="number">{ totalWeight }</td>
        <td className="number">{ totalBags }</td>
        <td className="price"></td>
        <td className="price"></td>
        <td className="price"></td>
      </tr>
    );
    return rows;

  }

  renderCart(cart) {
    const { discount_amount, totalPrice, grossPrice, shopDetail, selectedLorrySize, totalWeight } = cart;
    const shops = [];
    shopDetail.forEach( shop => {
      shops.push(this.renderShop(shop));
    });

    const totalPriceFixed = (+totalPrice).toFixed(2);
    const totalDiscount = (+discount_amount).toFixed(2);
    const totalWeightInTons = (+totalWeight)/10;
    let weightStatusColor = '#40bf80';
    if(totalWeightInTons > (+selectedLorrySize)) {
      weightStatusColor = '#ff3333';
    }


    return (
      <div className="cart">
        <div className="shopsDetails">
          <h3>Orders for Shops</h3>
          <hr />
          { shops }
        </div>
        <div className="summary">
          <h3>Summary</h3>
          <hr />
          <p>Total Price: <strong>₹{parseFloat(totalPriceFixed).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></p>
          <p>Total Discount: <strong>₹{parseFloat(totalDiscount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></p>
          <p>Total Order Weight: <strong>{totalWeightInTons}</strong> tons </p>
          <p>Selected Vehicle Capacity: <strong style={{color: weightStatusColor}}>{selectedLorrySize}</strong> tons </p>
        </div>
      </div>
    );

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

    const databaseRef = firebase.database().ref().child(orderPath).child('printsCount');
    databaseRef.transaction((printsCount) => {
      if(printsCount) {
        printsCount = printsCount + 1;
      } else {
        printsCount = 1;
      }
      this.setState({
        printsCount
      });
      return printsCount;
    });

  }


  render() {

    if(this.state.orderData.loading === LOADING) {
      return <Spinner spinnerName="ball-scale-multiple" />
    }

    const { nickname, name } = userInfo();
    const date = new Date();
    const timeString  =  date.toLocaleDateString()+ ' - ' + date.toLocaleTimeString();

    return (
      <div className="orderData page">
        { this.renderPageHeader() }
        { this.renderOrderDetails() }
        { this.renderMainOrder() }
        { this.renderAbstractOrder() }
        <footer>printed at { timeString } by <strong>{ nickname }</strong> ({ name })</footer>
      </div>
    );
  }

  renderPageHeader() {
    return (
      <div className="printPageHeader">
        <h5>Sree Lalitha Industries Pvt Ltd.</h5>
        <hr />
      </div>
    );
  }

  renderMainOrder() {
    return (
      <div>
        { this.renderCart(this.state.orderData.cart) }
        { this.renderSpecialMsg(this.state.orderData.orderMsg) }
      </div>
    );
  }

  renderOrderDetails() {
    const { time, userName} = this.state.orderData;
    const orderId = this.props.params.orderId;
    const orderDate = new Date(time);
    const orderTimeString  =  orderDate.toLocaleDateString()+ ' - ' + orderDate.toLocaleTimeString();

    const currentDate = new Date();
    const currentTimeString  =  currentDate.toLocaleDateString()+ ' - ' + currentDate.toLocaleTimeString();
    const delay = Math.abs(currentDate - orderDate) / 36e5;
    const delayInHours = delay.toFixed(2);


    return (
      <div className="orderHeader">
        <h3>{ userName }<span>{`'s Order`}</span></h3>
        <h3>{ orderId }</h3>
        <table>
          <tr>
            <td className="key">order time<span>:</span></td>
            <td className="value">{ orderTimeString }</td>
          </tr>
          <tr>
            <td className="key">print time<span>:</span></td>
            <td className="value">{ currentTimeString } ( { delayInHours } hrs later)</td>
          </tr>
          <tr>
            <td className="key">NO OF PRINTS<span>:</span></td>
            <td className="value">{this.state.printsCount}</td>
          </tr>
        </table>
      </div>
    );
  }

  renderAbstractOrder() {
    return (
      <div className="abstract details">
        <h4>ABSTRACT ORDER</h4>
        <hr />
        { this.renderAbstractOrderDetails() }
      </div>
    );
  }

}
export default OrderSheet;
