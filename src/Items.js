import React, { Component } from 'react';
import { Table } from 'reactstrap';



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
              <tr key={ counter }>
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

export default Items;
