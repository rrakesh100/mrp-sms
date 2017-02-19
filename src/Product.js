import React, { Component } from 'react';
import * as firebase from 'firebase';
import FaSolidCircle from 'react-icons/lib/fa/circle';


class Product extends Component {
  constructor(props) {
    super(props);
    //default values should be empty bag
    this.data = {
      productKey: this.props.productKey || '10KgLalithaBrown',
      productType: this.props.productType || 'rice'
    };

    this.state = {
      data: {}
    };
  }

  componentDidMount() {
    const pathOfProductData = `products/${this.props.productType}/${this.props.productKey}`;
    const productRef = firebase.database().ref().child(pathOfProductData);

    productRef.on('value', snap => {
      this.setState({
        data:  snap.val()
      });
    });
  }

  render() {
    //TODO - handle unknown bag type

    const imageUrl = `https://mrps-orderform.firebaseapp.com/${this.data.productType}_200/${this.data.productKey}.png`;
    console.log("IMG: "+imageUrl);
    return (
      <div className="product">
        <div className="left">
          <img src={ imageUrl } alt={ this.data.productKey }/>
        </div>
        <div className="right">
          <ul>
            <li><label>Name: </label> <span>{ this.state.data.name }</span> </li>
            <li><label>Master Weight: </label> <span>{ this.state.data.master_weight }</span></li>
            <li><label>Availability: </label> <span>{ this.state.data.available !== false ? <FaSolidCircle className="green"/> : <FaSolidCircle className="red"/> }</span></li>
            <li><label>Description: </label> <span>{ this.state.data.description }</span> </li>
          </ul>
        </div>
      </div>
    );
  }
}

Product.propTypes = {
  productType: React.PropTypes.string.isRequired,
  productKey: React.PropTypes.string.isRequired
};

export default Product;
