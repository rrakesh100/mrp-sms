import React, { Component } from 'react';

class Outlet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data || {}
    };
  }

  render() {
    const imageUrl = `https://mrps-orderform.firebaseapp.com/defaultOutletImg.png`;
    const { name, proprietor, mobile, mobile_alt, shopId, address, PAN, TAX_ID } = this.state.data;
    return (
      <div className="product">
        <div className="left">
          <img src={ imageUrl } alt={ `RAM`}/>
        </div>
        <div className="right">
          <ul>
            <li><label>Shop Unique Id: </label> <span>{ shopId }</span> </li>
            <li><label>Shop Name: </label> <span>{ name }</span> </li>
            <li><label>Proprietor: </label> <span>{ proprietor }</span></li>
            <li><label>Mobile: </label><span>{ `${mobile}, ${mobile_alt}` }</span></li>
            <li><label>PAN: </label> <span>{ PAN }</span> </li>
            <li><label>TAX ID: </label> <span>{ `${TAX_ID.type}: ${TAX_ID.value}` }</span> </li>
            <li><label>Address: </label><span>{ address }</span></li>
          </ul>
        </div>
      </div>
    );
  }

}

export default Outlet;
