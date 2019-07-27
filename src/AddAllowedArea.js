import React, { Component } from 'react';
import * as firebase from 'firebase';
import AlertContainer from 'react-alert';
import { Button } from 'semantic-ui-react';


class AddAllowedArea extends Component {
  constructor(props) {
    super(props);
    this.state={
      areasList:[],
      areaSelected:false,
      userId:props.userId,
    }
  }


  componentDidMount() {
    const areasPath = `areas`;
    const areasRef = firebase.database().ref().child(areasPath);
    areasRef.once('value', snap => {
      let areasObj=snap.val();
      let areasList=[];
      areasObj && Object.keys(areasObj).map((area) => {
        let areaObj=areasObj[area];
        let obj={
          'areaId':areaObj.areaId,
          'displayName':areaObj.displayName
        }
        areasList.push(areaObj.areaId)
      })
      this.setState({areasList, areasObj});
    })
  }


  saveArea() {
    const {selectedArea,userId, areasObj} = this.state;
    let selectedAreaObj=areasObj[selectedArea];
    let areasRefPath=`users/${userId}/allowedAreas`;;
    let areasRef = firebase.database().ref().child(areasRefPath);
    areasRef.push(selectedAreaObj);
    this.props.closeModal();
  }

  renderAllAreas() {
    const {areasList, selectedArea, areaSelected}=this.state;
    let returnedAreas= areasList.length>0 && areasList.map((item) => {
      return (
        <div onClick={() => this.setState({selectedArea:item, areaSelected:!areaSelected})}
        style={areaSelected && selectedArea === item?
          {
          height:20,
          backgroundColor:'#16A085',
          marginTop:2
        }: {
          height:20,
          backgroundColor:'#E6E6FF',
          marginTop:2
        }}>
          <div>{item}</div>
        </div>
      )
    })
    return (
      <div>
        <Button className="save-button" bsStyle="primary" onClick={ this.saveArea.bind(this) } >
          Add Area
        </Button>
        {returnedAreas}
      </div>
    );
  }

  render() {

    return (
      <div className="area" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <AlertContainer ref={ a => this.msg = a} {...this.alertOptions} />
        {this.renderAllAreas()}
      </div>
    );
  }

}

export default AddAllowedArea;
