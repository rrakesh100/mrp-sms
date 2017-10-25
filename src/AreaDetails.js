import React, { Component } from 'react';
import * as firebase from 'firebase';
import Spinner from 'react-spinkit';
import { Table } from 'reactstrap';
import  Img from 'react-image';
import { Header, Divider, Message } from 'semantic-ui-react';




const LOADING = 'loading';
const ERROR = 'error';

export default class AreaDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      areaData: {
        loading: LOADING
      }
    };
  }

  componentDidMount() {
    const areaDetailsPath = `priceList/${this.props.params.areaId}`;
    const areaDetailsRef = firebase.database().ref().child(areaDetailsPath);
    areaDetailsRef.on('value', snap => {
      const areaData = snap.val();
      if(areaData) {
        this.setState({
          areaData
        });
      } else {
        this.setState({
          areaData: {
            loading: ERROR
          }
        });
      }
    });

    const usersPath = `users`;
    const usersRef = firebase.database().ref().child(usersPath);
    usersRef.on('value', snap => {
      const usersData = snap.val();
      const shopsInArea = [];
      Object.keys(usersData).forEach( key => {
        const userData = usersData[key];
        if(userData.shops) {
          userData.shops.forEach( shop => {
            if(shop.areaId === this.props.params.areaId) {
              shopsInArea.push({
                ...shop,
                agentId: key
              });
            }
          });
        }

      });
      if(shopsInArea && shopsInArea.length > 0 ) {
        this.setState({
          shopsInArea
        });
      }

    });
  }

  render() {

    if(this.state.areaData.loading === LOADING) {
      return <Spinner spinnerName="double-bounce" />
    }

    return (
      <div className="areaDetails">
        <Header as='h1' block><strong>{ this.props.params.areaId }</strong> area</Header>
        <Divider horizontal><h2>Prices</h2></Divider>
        { this.renderAreaItemPrices() }
        <Divider horizontal><h2>Shops</h2></Divider>
        { this.renderAreaShops() }
      </div>
    );
  }

  renderAreaShops() {
    return (
      <div className="areaShops">
        <Table bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>NAME</th>
              <th>AGENT MOBILE</th>
              <th>AREA NAME</th>
              <th>CITY</th>
              <th>ADDRESS</th>
              <th>DISTRICT</th>
              <th>GST</th>
            </tr>
          </thead>
          <tbody>
            { this.renderShop() }
          </tbody>
        </Table>
      </div>
    );
  }

  renderShop() {
    const { shopsInArea } = this.state;
    if(shopsInArea && shopsInArea.length > 0) {
      return shopsInArea.map( (shop, idx) => {
        return (
          <tr key={idx}>
            <td>{ idx }</td>
            <td className="name">{ shop.name }</td>
            <td className="mobile">{ shop.agentId }</td>
            <td>{ shop.areaName }</td>
            <td>{ shop.city }</td>
            <td>{ shop.address }</td>
            <td>{ shop.district }</td>
            <td>{ shop.tin }</td>
          </tr>
        );
      })
    } else {
      return <tr><td>---- There are no shops in this area ---</td></tr>
    }
  }
  renderAreaItemPrices() {
    const { areaData } = this.state;
    const prices = [];
    if(areaData && areaData.loading !== 'error') {
      Object.keys(areaData).forEach( productType => {
        prices.push(
          <div className="productType" key={productType}>
            <h3>{ productType }</h3>
            <Table bordered>
              <thead>
                <tr>
                  <th className="image">PRODUCT</th>
                  <th>AGENT PRICE</th>
                  <th>OUTLET PRICE</th>
                </tr>
              </thead>
              <tbody>
                { this.renderProductTypePrices(areaData[productType], productType) }
              </tbody>
            </Table>
          </div>
        );
      });
    } else {
      prices.push(
        <Message
          icon='settings'
          header='Prices are not set for this area!'
          content='Please set prices for this area in the price list page'
        />
      );
    }

    return prices;
  }

  renderProductTypePrices(products, productType) {
    const productItem = [];
    Object.keys(products).forEach( item => {
      const imageUrl = `https://mrps-orderform.firebaseapp.com/${productType}_200/${item}.png`
      const agentPrice = products[item]['Agent'] || 0;
      const outletPrice = products[item]['Outlet'] || 0;

      productItem.push(
        <tr className="productItem" key={item}>
          <td className="image">
            <div>
              <div className="text">{item}</div>
              <Img alt={ item } src={ imageUrl } height={ 100 }/>
            </div>
          </td>
          <td className="agent">{ parseFloat(agentPrice).toLocaleString('en-IN') }</td>
          <td className="outlet">{ parseFloat(outletPrice).toLocaleString('en-IN') }</td>
        </tr>
      );
    });
    return productItem;
  }




}
