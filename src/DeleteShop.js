import React, { Component } from 'react';
import {  Button, Icon,Header, Image, Modal} from 'semantic-ui-react';
import * as firebase from 'firebase';

class DeleteShop extends Component {

  constructor(props){
    super(props);
    this.state = {
      index : this.props.index,
      userId : this.props.userId
    }

  }

  deleteShop() {
    let {userId, index} = this.state;
    console.log('deleteing shop at ', userId, index);
    const shopsPath = `users/${userId}/shops/${index}`;
    console.log('shops path = ', shopsPath);
    const shopsRef = firebase.database().ref().child(shopsPath);
    shopsRef.remove();
  }


 render(){
   return (
     <div>
     <Button color='red' onClick={()=> this.props.closeDeleteShop()}>
       <Icon name='remove' /> No
     </Button>
     <Button color='green' onClick={()=> {
       console.log(this.state.index);
       this.deleteShop();
       this.props.closeDeleteShop()
     }}>
       <Icon name='checkmark' /> Yes
     </Button>
     </div>
   )
 }
}

export default DeleteShop;
