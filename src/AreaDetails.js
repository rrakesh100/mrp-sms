import React, { Component } from 'react';
import * as firebase from 'firebase';
import Spinner from 'react-spinkit';
import { Table } from 'reactstrap';
import  Img from 'react-image';




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
      if(shopsInArea.length > 0 ) {
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
        <h1>Area: { this.props.params.areaId }</h1>
        <h2>Prices</h2>
        <hr />
        { this.renderAreaItemPrices() }
        <h2>Shops</h2>
        <hr />
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
              <th>Name</th>
              <th>Agent Mobile</th>
              <th>areaName</th>
              <th>city</th>
              <th>address</th>
              <th>district</th>
              <th>tin</th>
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
    if(shopsInArea.length > 0) {
      return shopsInArea.map( shop => {
        return (
          <tr>
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
    }
  }
  renderAreaItemPrices() {
    const { areaData } = this.state;
    const prices = [];
    if(areaData) {
      Object.keys(areaData).forEach( productType => {
        prices.push(
          <div className="productType">
            <h3>{ productType }</h3>
            <Table bordered>
              <thead>
                <tr>
                  <th className="image">Product</th>
                  <th>Agent Price</th>
                  <th>Outlet Price</th>
                </tr>
              </thead>
              <tbody>
                { this.renderProductTypePrices(areaData[productType], productType) }
              </tbody>
            </Table>
          </div>
        );
      });
    }

    return prices;
  }

  renderProductTypePrices(products, productType) {
    const productItem = [];
    Object.keys(products).forEach( item => {
      const imageUrl = `https://mrps-orderform.firebaseapp.com/${productType}_200/${item}.png`
      productItem.push(
        <tr className="productItem" key={item}>
          <td className="image">
            <div>
              <div className="text">{item}</div>
              <Img alt={ item } src={ imageUrl } height={ 100 }/>
            </div>
          </td>
          <td className="agent">{ products[item]['Agent'] }</td>
          <td className="outlet">{ products[item]['Outlet'] }</td>
        </tr>
      );
    });
    return productItem;
  }




}
