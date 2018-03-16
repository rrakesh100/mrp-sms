import React, { Component } from 'react';
import * as firebase from 'firebase';
import outletData from './feedback.json';
import { Button, Form, Message, Divider } from 'semantic-ui-react';


let count = 0;


class FeedbackInput extends Component {

  onClick(e) {
    console.log(outletData);
    outletData.forEach(row => {
      const {	gst } = row;
      console.log("Count=" + count++);
      console.log(JSON.stringify(row, null, 2));

      const gstRef = firebase.database().ref().child(`feedback/${gst}`);
      gstRef.set({
        ...row
      }, error => {
        if(error) {
          console.warn (`[${count}] - Update failed for ${gst}` + JSON.stringify(error, null, 2));
        } else {
          console.log(`[${count}] - ${gst} has been added Successfully`);
        }
      });

    });
  }

  render() {
    return  (
      <div>
        <Button primary onClick={ this.onClick.bind(this) }>CLICK TO LOAD FEEDBACK DATA</Button>
      </div>
    );
  }
}
export default FeedbackInput;
