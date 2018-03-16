import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Button, Form, Message, Divider, Loader } from 'semantic-ui-react'
// import { Print } from 'react-easy-print';
// import QRCode from 'react-qr-svg';
// import { QRCode } from 'react-qr-svg';
import QRCode from 'react-qr-component'





const LOADING = 'loading';
const ERROR = 'error';

class Poster extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shopInfo: {
        loading: LOADING
      },
      open: false
    };
  }

  componentDidMount() {
    const gstInfoPath = `feedback/${this.props.params.gst}`;
    const gstRef = firebase.database().ref().child(gstInfoPath);
    gstRef.on('value', snap => {
      const shopInfo = snap.val();
      if(shopInfo) {
        this.setState({
          shopInfo
        });
      } else {
        this.setState({
          shopInfo: {
            loading: ERROR
          }
        });
      }
    });
  }


  render() {

    if(this.state.shopInfo.loading === LOADING) {
      return <Loader />
    }

    const { gst, shopName, city, district } = this.state.shopInfo;
    return  (
      <div className='feedback poster orderData page'>
        <div className='header'>
          <h2>Thank you for shopping at</h2>
          <h1>{shopName}</h1>
          <h2>{city !== 'None' ? `${city},` : ''} {district}</h2>
          <Divider />
          <h2>Scan QR Code for Feedback</h2>
        </div>
        <div className='qrcode'>
          <QRCode value={`mrpsolutions.in/fb/${gst}`} size={512}/>
        </div>
        <h6>powered by MRP Solutions</h6>
      </div>
    );
  }
}
export default Poster;
