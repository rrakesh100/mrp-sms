import React, { Component } from 'react';
import * as firebase from 'firebase';
import Button from 'react-button';
import outletData from './test.json';

let count = 0;


class Input extends Component {

  onClick(e) {
    console.log(outletData);
    outletData.forEach(row => {
      const name = row.name,
        email = row.email,
        pass = row.pass,
        address = row.city,
        shopName = row.name,
        proprietorName = row.name,
        shopTin = row.shopTin,
        shopNumber = '',
        street = '',
        areaId = row.areaId,
        areaName = row.areaId,
        district = row.areaId,
        city =row.city,
        state = row.state || 'AP',
        pincode = '',
        taxType = 'VAT';
      console.log("Count=" + count++);
      console.log(JSON.stringify(row, null, 2));
      this.createUsers(name, email,pass,address,shopName,proprietorName,shopTin,shopNumber,street,areaId,areaName,district,city,state,pincode,taxType);
      //this.deleteUsers(email);
    });
  }

  render() {
    return  (
      <div>
        <Button onClick={ this.onClick.bind(this) }>CLICK TO LOAD DATA</Button>
      </div>
    );
  }


  deleteUsers(email) {
    var authRef = firebase.auth();
    var promise = authRef.getUserByEmail(email);
    promise.then(function(userData) {
      alert(JSON.stringify(userData, null, 2));
    }).catch(function(e){
      console.log(e);
    });
  }

  createUsers(name, email,pass,address,shopName,proprietorName,shopTin,shopNumber,street,areaId,areaName,district,city,state,pincode,taxType) {
  	var authRef = firebase.auth();
    var dbRef = firebase.database().ref();
  	var promise = authRef.createUserWithEmailAndPassword(email,pass);
  	promise.then(function(e) {
			//get the authId
      var authId=e.uid;

    	//set the authMobilemapping
  		var authIdMobileMapRef = dbRef.child('authMobileMap/' + authId);
  		authIdMobileMapRef.set(pass);

      //create the address

		 var fulladdress = shopNumber + " ; " +
    		street + " ; " +
    		areaName + " ; " +
    		district + " ; " +
    		city+";"
    		state  + "; " +
    		pincode;

    		// create shops
  		var shops = [{
      	name: shopName,
      	proprietor_name : proprietorName,
      	mobile : pass,
      	tin : shopTin,
      	state : state,
      	areaId : areaId,
      	areaName : areaName,
      	district : district,
      	city : city,
      	address : fulladdress,
      	taxType : taxType
	    }];
    	//create the user object
  		var foo = {}; var now = (new Date().getTime()) * -1;
  		foo = {
  			email : email,
  			active: true,
  			name : name ,
  			mobile : pass,
  			isAgent : false,
  			address : address,
  			authId : authId,
  			priority : now,
  			shops : shops
			};

			//set the user
  		var usersRef = dbRef.child('users/'+ pass );
      var promise = usersRef.set(foo);
    }).catch(function(e){
      console.log(e);
    });
  }
}
export default Input;
