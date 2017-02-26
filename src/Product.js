import React, { Component } from 'react';
import * as firebase from 'firebase';
import FaSolidCircle from 'react-icons/lib/fa/circle';
import FaEdit from 'react-icons/lib/fa/edit';
import FaDelete from 'react-icons/lib/fa/trash-o';
import { Modal, Button } from 'react-bootstrap';
import AddProduct from './AddProduct';



class Product extends Component {
  constructor(props) {
    super(props);
    //default values should be empty bag
    this.data = {
      productKey: this.props.productKey,
      productType: this.props.productType
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


  closeConfirmModal() {
    this.setState({ showConfirmModal: false });
  }

  openConfirmModal() {
    this.setState({
      showConfirmModal: true
    });
  }

  closeEditModal() {
    this.setState({
      showEditModal: false
    });
  }

  openEditModal() {
    this.setState({
      showEditModal: true
    });
  }

  onDeleteProduct(e) {
    console.log("PRODUCT TO DELETE: " + this.props.productKey);
    const productPath = `products/${this.props.productType}/${this.props.productKey}`;
    const productRef = firebase.database().ref().child(productPath);
    productRef.remove();
    this.closeConfirmModal();
  }

  getConfirmModal() {
    const { productType, productKey } = this.props;
    return <Modal show={this.state.showConfirmModal} onHide={this.closeConfirmModal.bind(this)}>
      <Modal.Header closeButton>
        <Modal.Title>Delete { productType } item  {productKey}?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete product <bold>{ productType } item  {productKey}</bold>?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={ this.onDeleteProduct.bind(this) }>Delete Product</Button>
      </Modal.Footer>
    </Modal>;
  }

  getEditModal() {
    if(!this.state.data) {
      return;
    }

    const { productType, productKey } = this.props;

    return <Modal show={this.state.showEditModal} onHide={ this.closeEditModal.bind(this) } bsSize="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit { productType } item { productKey }?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddProduct productType={ productType } productKey={ productKey } mode={ 'edit' } { ...this.state.data } onClose={ this.closeEditModal.bind(this) } />
      </Modal.Body>
    </Modal>;
  }

  render() {
    //TODO - handle unknown bag type

    const confirmModal =  this.getConfirmModal();
    const editModal =  this.getEditModal();

    const imageUrl = `https://mrps-orderform.firebaseapp.com/${this.data.productType}_200/${this.data.productKey}.png`;
    console.log("IMG: "+imageUrl);
    return (
      <div className="product">
        { confirmModal }
        { editModal }
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
        <div className="actions">
          <div className="action" onClick={ this.openEditModal.bind(this) }><FaEdit /></div>
          <div className="action" onClick={ this.openConfirmModal.bind(this) }><FaDelete /></div>
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
