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
      existingAreas:props.existingAreas,
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

    let ref=this;

    areasRef.transaction(function(areas){
              areas=areas||[];
              areas.push(selectedAreaObj['areaId']);
              return areas;
    }, function(success) {
        ref.msg.success( <div className="success"><h4>Area </h4> is Successfully Saved</div>, {
          time: 2000,
          type: 'success',
        });
      }
     );


    this.props.closeModal();
  }

  renderAllAreas() {
    const {areasList, selectedArea, areaSelected, existingAreas}=this.state;
    let filteredAreas=areasList.length>0 && areasList.filter(val => !existingAreas.includes(val));
    let returnedAreas= filteredAreas.length>0 && filteredAreas.map((item) => {
      return (
        <div onClick={() => this.setState({selectedArea:item, areaSelected:!areaSelected})}
        style={areaSelected && selectedArea === item?
          {
          height:18,
          backgroundColor:'#16A085',
          marginTop:1
        }: {
          height:18,
          backgroundColor:'#E6E6FF',
          marginTop:1
        }}>
          <div style={{fontSize:12, textAlign:'center', color:'black'}}>{item}</div>
        </div>
      )
    })
    return (
      <div>
        {returnedAreas}
      </div>
    );
  }

  render() {

    return (
      <div className="area">
        <AlertContainer ref={ a => this.msg = a} {...this.alertOptions} />
        {this.renderAllAreas()}
        <Button style={{
          marginLeft: '40%',
          marginTop:12,
          color:'#fff',
          backgroundColor: '#009C95',
          width:'22%'
        }} onClick={ this.saveArea.bind(this) } >
          Add Area
        </Button>
      </div>
    );
  }

}

export default AddAllowedArea;
