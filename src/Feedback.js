import React, { Component } from 'react';
import * as firebase from 'firebase';
import moment from 'moment';
import { Button, Form, Message, Divider, Loader } from 'semantic-ui-react';


const LOADING = 'loading';
const ERROR = 'error';

class Feedback extends Component {

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
        }, this.loadProducts.bind(this))
      } else {
        this.setState({
          shopInfo: {
            loading: ERROR
          }
        });
      }
    });
  }

  loadProducts() {
    const productRef = firebase.database().ref().child('products');
    productRef.on('value', snap => {
      const products = snap.val();
      console.log(JSON.stringify(products, null, 2));
    });
  }

  updateInputValue(field, event) {
    console.log(field + " changed to " + event.target.value);
    this.setState({
      [field]: event.target.value
    });
  }

  submitFeedback() {
    console.log('Submitted feedback');
    const gst = this.props.params.gst;
    const date = new Date();
    const dateStr = moment(date).format('DD-MM-YYYY');
    const dbRef = firebase.database().ref();
    const newPostKey = dbRef.child(`gstFeedback/${gst}/${dateStr}`).push().key;
    const { name, mobile, product, feedback } = this.state;
    const data = { ...this.state.shopInfo, date, name, mobile, product, feedback };

    const updates = {};
    updates[`gstFeedback/${gst}/${dateStr}/${newPostKey}`] = data;
    updates[`globalFeedback/${dateStr}/${newPostKey}`] = data;
    dbRef.update(updates)
      .then(
        this.setState({
          submitted: true
        })
      );
  }


  render() {

    if(this.state.shopInfo.loading === LOADING) {
      return <Loader size='massive' />
    }

    if(this.state.submitted === true) {
      return (
        <div className='feedback thanks'>
          <div className='header'>
            <h4>Thanks a lot for your feedback</h4>
            <h1>🙏</h1>
            <h2>Come Visit Again Soon</h2>
          </div>
          <h6>powered by MRP Solutions</h6>
        </div>
      )
    }

    const { gst, shopName, city, district } = this.state.shopInfo;
    return (
      <div className='feedback'>
        <div className='header'>
          <h4>Thanks for shopping at</h4>
          <h2>{shopName}</h2>
          <h2>{city !== 'None' ? `${city},` : ''} {district}</h2>
          <h5>We solicit your feedback on Lalitha Products</h5>
        </div>
        <Form as="div" success error warning>
          <Form.Input label='NAME' placeholder='Name' onChange={ this.updateInputValue.bind(this,'name') }  error={!this.state.name}/>
          <Form.Input label='MOBILE' placeholder='mobile' onChange={ this.updateInputValue.bind(this,'mobile') }  error={!this.state.mobile}/>
          <Form.Input label='PRODUCT' placeholder='Product' onChange={ this.updateInputValue.bind(this,'product') }  error={!this.state.product}/>
          <Form.TextArea label='FEEDBACK' placeholder='feedback' onChange={ this.updateInputValue.bind(this,'feedback') }  error={!this.state.product}/>
          <Button primary fluid onClick={ () => { this.submitFeedback() }}>SUBMIT</Button>

        </Form>
        <h6>powered by MRP Solutions</h6>
      </div>
    );
  }
}
export default Feedback;
