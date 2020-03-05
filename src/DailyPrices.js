import React from 'react';
import * as firebase from 'firebase';
import { Header, Table, Rating, Button } from 'semantic-ui-react'
import moment from 'moment';

class DailyPrices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dailyPriceData: null,
      constituencyOptions:[],
      selectedOption:'',
      selectedState:'',
      todayPricesData:null
    };
  }

  fetchStates() {
    const path = `statesVsConstituencies`;
    const pathRef = firebase.database().ref().child(path);
    pathRef.on('value', snap => {
      const stateData = snap.val();
      console.log(stateData);
      this.setState({
        stateData
      })
    })
  }

  fetchDailyPrices() {
    const dailyPricePath = `dailyPricesAdmin`;
    const dailyPriceRef = firebase.database().ref().child(dailyPricePath);
    dailyPriceRef.on('value', snap => {
      const dailyPriceData = snap.val();
      this.setState({
        dailyPriceData
      })
    })
  }

  componentDidMount() {
    this.fetchStates();
    this.fetchDailyPrices();
  }

  fetchTodayPricesData = () => {
     const date = new Date();
     const dateStr = moment(date).format('DD-MM-YYYY');
     const {dailyPriceData, selectedOption}=this.state;
     let pricesDataObj=dailyPriceData[dateStr]['constituencies'][selectedOption];
     this.setState({
       todayPricesData: pricesDataObj
     })
  }

  handleChange = (event) => {
    this.setState({
      selectedOption: event.target.value
    },this.fetchTodayPricesData);
  }

  handleStateChange = (event) => {
    this.setState({
      selectedState: event.target.value
    })
  }

  renderConstituencySelectField() {
    const {stateData,selectedState}=this.state;
    let constituencyData = stateData[selectedState].constituencies;
    return (
      <div style={{ width : '20%', marginLeft: '2%'}}>
      <select style={{ width : '100%', height : 40}} value={this.state.selectedOption} onChange={this.handleChange}>
      <option> Please select a constituency</option>
        {
          constituencyData && Object.keys(constituencyData).map(eachConstituency => {
            return <option key={eachConstituency} value={eachConstituency}>{eachConstituency}</option>
          })
        }
      </select>
      </div>
    )
  }

  renderVarietyTables() {
    const {todayPricesData}=this.state;
    console.log(todayPricesData);
    let renderTables=[];
    todayPricesData && Object.keys(todayPricesData).map(eachCategory => {
      let eachCategoryData=todayPricesData[eachCategory];
      console.log(eachCategoryData);
      eachCategoryData && Object.keys(eachCategoryData).map((eachVariety,index) => {
        let eachVarietyData=eachCategoryData[eachVariety]['agentPrice'];
      renderTables.push(
        <div style={{marginLeft: '2%'}}>
        <Table celled padded>
         <Table.Header>
           <Table.Row>
           <Table.HeaderCell singleLine>Category</Table.HeaderCell>
             <Table.HeaderCell singleLine>Variety</Table.HeaderCell>
             <Table.HeaderCell>Mobile Number</Table.HeaderCell>
             <Table.HeaderCell>Weight</Table.HeaderCell>
             <Table.HeaderCell>Price</Table.HeaderCell>
             <Table.HeaderCell>Moisture</Table.HeaderCell>
             <Table.HeaderCell>Freight</Table.HeaderCell>
             <Table.HeaderCell>Total Price</Table.HeaderCell>
           </Table.Row>
         </Table.Header>
         <Table.Body>
           {Object.keys(eachVarietyData).map(eachNumber => {
             let agentDataForAVariety=eachVarietyData[eachNumber];
               return (
                 <Table.Row key={eachVariety}>
                   <Table.Cell>{eachCategory}</Table.Cell>
                   <Table.Cell>{eachVariety}</Table.Cell>
                   <Table.Cell>{eachNumber}</Table.Cell>
                   <Table.Cell>{agentDataForAVariety.weight}</Table.Cell>
                   <Table.Cell>{agentDataForAVariety.price}</Table.Cell>
                   <Table.Cell>{agentDataForAVariety.moisture}</Table.Cell>
                   <Table.Cell>{agentDataForAVariety.freight}</Table.Cell>
                   <Table.Cell>{agentDataForAVariety.totalPrice}</Table.Cell>
                 </Table.Row>
               )
           })}
         </Table.Body>
       </Table>
       </div>
      )
    })
  })
    return renderTables;
  }

  onEditClick = () => {
    console.log('edit');
  }

  renderAskingPrices() {
    const {todayPricesData}=this.state;
    let askingPrices=todayPricesData && todayPricesData.askingPrices;
    return (
      <div>
        {todayPricesData &&
        <div>
        <h2>Asking Prices</h2>
        <Table celled padded>
         <Table.Header>
           <Table.Row>
             <Table.HeaderCell>Variety</Table.HeaderCell>
             <Table.HeaderCell>Sub variety</Table.HeaderCell>
             <Table.HeaderCell>Price</Table.HeaderCell>
             <Table.HeaderCell>Moisture</Table.HeaderCell>
             <Table.HeaderCell>Freight</Table.HeaderCell>
             <Table.HeaderCell></Table.HeaderCell>
           </Table.Row>
         </Table.Header>
         <Table.Body>
           {todayPricesData && Object.keys(askingPrices).map(eachVariety => {
             let varietyData=askingPrices[eachVariety];
             return Object.keys(varietyData).map(eachItem => {
               let eachSubVarietyData=varietyData[eachItem];
                 return (
                   <Table.Row>
                     <Table.Cell>{eachVariety}</Table.Cell>
                     <Table.Cell>{eachItem}</Table.Cell>
                     <Table.Cell>{eachSubVarietyData.price}</Table.Cell>
                     <Table.Cell>{eachSubVarietyData.moisture}</Table.Cell>
                     <Table.Cell>{eachSubVarietyData.freight}</Table.Cell>
                     <Table.Cell>
                      <Button content='Edit' onClick={this.onEditClick}/>
                     </Table.Cell>
                   </Table.Row>
                 )
             })
           })}
         </Table.Body>
       </Table>
       </div>}
      </div>
    )
  }

  renderStateSelectField() {
    const {stateData}=this.state;
    return (
      <div style={{ width : '20%'}}>
      <select style={{ width : '100%', height : 40}} value={this.state.selectedState} onChange={this.handleStateChange}>
      <option> Please select a state</option>
        {
          stateData && Object.keys(stateData).map(eachState => {
            return <option key={eachState} value={eachState}>{stateData[eachState].name}</option>
          })
        }
      </select>
      </div>
    )
  }

  render() {
    return (
      <div>
       <div style={{display : "flex", width : '92%', marginLeft: '4%'}}>
          {this.renderStateSelectField()}
          {this.state.selectedState && this.renderConstituencySelectField()}
       </div>
        <div style={{margin:20}}>
          {this.renderVarietyTables()}
        </div>
        <div style={{margin:20}}>
        </div>
      </div>
    )
  }
}

export default DailyPrices;
