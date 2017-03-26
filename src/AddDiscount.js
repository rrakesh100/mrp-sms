import React, { Component } from 'react';
import ObjectAssign from 'object-assign';
import { Button } from 'react-bootstrap';
import FaSave from 'react-icons/lib/fa/floppy-o';

class AddDiscount extends Component {
  constructor(props) {
    super(props);
    this.maxNoOfDiscountRows = 3;
    this.defaultState = this.getDefaultState(this.props.discounts);
    this.state = {
      ...this.defaultState
    }
  }

  updateInputValue(productType, index, updateType, e) {
    console.log(productType + '[' + index + ']' + updateType + '=' + e.target.value);
    let productTypeDiscounts = ObjectAssign({}, this.state);
    productTypeDiscounts[productType][index][updateType] = e.target.value;
    this.setState({
      ...productTypeDiscounts
    });
  }

  getDefaultState(discounts) {
    let defaultDiscounts = {
      rice: [
          {discount:'',quintals:''},
          {discount:'',quintals:''},
          {discount:'',quintals:''}
        ],
      ravva: [
          {discount:'',quintals:''},
          {discount:'',quintals:''},
          {discount:'',quintals:''}
        ]
    };

    Object.keys(discounts).forEach(productType => {
      const productTypeDiscounts = discounts[productType];
      productTypeDiscounts.forEach((discount, index) => {
        defaultDiscounts[productType][index] = {
          discount: discount.discount,
          quintals: discount.quintals
        };
      });
    });
    return defaultDiscounts;
  }

  saveDiscounts() {
    console.log(JSON.stringify(this.state,null,2));
    let discountData = {};

    Object.keys(this.state).forEach(productType => {
      const productTypeDiscounts = this.state[productType];
      let priviousDiscountLimit = 0;
      productTypeDiscounts.forEach( (discount, index) => {
        //validations
        if(isNaN(discount.quintals) && isNaN(discount.discount)) {
          return;
        }
        if(isNaN(discount.quintals)) {
          alert('Invalid quintals number for ' + productType + ' in row #' + `${index + 1}`);
        }

        if(isNaN(discount.discount)) {
          alert('Invalid discount for ' + productType + ' in row #' + `${index + 1}`);
        }

        if(parseFloat(discount.quintals) < priviousDiscountLimit ) {
          alert('Quintal limits should be in ascending order.' + parseFloat(discount.quintals) + ' should be more than ' + priviousDiscountLimit );
        } else {
          priviousDiscountLimit = parseFloat(discount.quintals);
        }

        if(discount.discount && discount.quintals) {
          if(!discountData[productType]) {
            discountData[productType] = [];
          }

          discountData[productType].push({
            ...discount
          });
        } else if (discount.discount || discount.quintals) {
          alert('In ' + productType + ' discounts, row #' + `${index+1}` + ' is invalid. Please correct it');
        }
      });
    });
    //format discounts data
    this.props.onChange(discountData);
    console.log("AFTER CLEANUP" + JSON.stringify(discountData,null,2));

  }


  getDiscountRows(productType) {
    const discountRows = [];
    for(let i = 0; i < this.maxNoOfDiscountRows; i++) {
      if(this.state && this.state[productType]) {
        const qntName = `quintals${i}`;
        const discountName = `discount${i}`;
        const qntValue = this.state[productType][i].quintals;
        const discountValue = this.state[productType][i].discount;
        discountRows.push(
          <tr>
            <td>
            <input type="text"
              name={qntName}
              value={ qntValue }
              onChange={ this.updateInputValue.bind(this, productType, i, 'quintals') }
              placeholder="quintals">
              </input>
            </td>
            <td>
            <input type="text"
              name={discountName}
              value={ discountValue }
              onChange={ this.updateInputValue.bind(this, productType, i, 'discount') }
              placeholder="discount"></input>
            </td>
          </tr>
        );

      }
    }
    return (
      <table className="discounts">
        <tr>
          <th className="quintals">Quintals</th>
          <th className="discount">Discount</th>
        </tr>
          { discountRows }
      </table>
    );
  }

  getProductDiscounts(productType) {
    return (
      <div>
        <h4>{productType}</h4>
        { this.getDiscountRows(productType)}
      </div>
    );
  }


  render() {
    const productDiscountsArray = [];
    ['rice','ravva'].forEach(productType => {
      productDiscountsArray.push(this.getProductDiscounts(productType));
    });

    return (
      <div className="all-discounts">
        { productDiscountsArray }
        <Button className="save-discounts" bsStyle="primary" onClick={ this.saveDiscounts.bind(this) }> <FaSave />Save Discounts</Button>
      </div>
    );

  }

}

AddDiscount.propTypes = {
  onChange: React.PropTypes.func.isRequired,
};

export default AddDiscount;
