import React from 'react';
import * as firebase from 'firebase';
import { Header, Table, Rating } from 'semantic-ui-react'
import moment from 'moment';

class DailyPrices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dailyPriceData: null,
      constituencyOptions:[],
      selectedOPtion:'',
      todayPricesData:null
    };
  }

  fetchConstituencies() {
    const constituencyPath = `constituency`;
    const constituencyRef = firebase.database().ref().child(constituencyPath);
    constituencyRef.on('value', snap => {
      const constituencyData = snap.val();
      this.setState({
        constituencyData
      })
    })
  }

  fetchDailyPrices() {
    const dailyPricePath = `dailyAdmin`;
    const dailyPriceRef = firebase.database().ref().child(dailyPricePath);
    dailyPriceRef.on('value', snap => {
      const dailyPriceData = snap.val();
      this.setState({
        dailyPriceData
      })
    })
  }

  componentDidMount() {
    this.fetchConstituencies();
    this.fetchDailyPrices();
  }

  fetchTodayPricesData = () => {
     // let varietyVsNumbersData={};
     const date = new Date();
     const dateStr = moment(date).format('DD-MM-YYYY');
     const {dailyPriceData, selectedOPtion}=this.state;
     let pricesDataObj=dailyPriceData[dateStr][selectedOPtion];
     // Object.keys(pricesDataObj).map(eachNumber => {
     //   console.log(eachNumber);
     //   let varitiesObj=pricesDataObj[eachNumber];
     //   console.log(varitiesObj);
     //   varietyVsNumbersData.
     // })
     this.setState({
       todayPricesData: pricesDataObj
     })
  }

  handleChange = (event) => {
    this.setState({
      selectedOPtion: event.target.value
    },this.fetchTodayPricesData);
  }

  renderSelectField() {
    const {constituencyData}=this.state;
    return (
      <select value={this.state.selectedOPtion} onChange={this.handleChange}>
        {
          constituencyData && Object.keys(constituencyData).map(eachConstituency => {
            return <option key={eachConstituency} value={eachConstituency}>{eachConstituency}</option>
          })
        }
      </select>
    )
  }

  renderVarietyTables() {
    const {todayPricesData}=this.state;
    let renderTables=[];
    todayPricesData && Object.keys(todayPricesData).map(eachVariety => {
      let varietyData=todayPricesData[eachVariety];
      renderTables.push(
        <Table celled padded>
         <Table.Header>
           <Table.Row>
             <Table.HeaderCell singleLine>{eachVariety}</Table.HeaderCell>
             <Table.HeaderCell>Price</Table.HeaderCell>
             <Table.HeaderCell>Moisture</Table.HeaderCell>
             <Table.HeaderCell>Freight</Table.HeaderCell>
             <Table.HeaderCell>Mobile Number</Table.HeaderCell>
             <Table.HeaderCell>Price</Table.HeaderCell>
             <Table.HeaderCell>Moisture</Table.HeaderCell>
             <Table.HeaderCell>Freight</Table.HeaderCell>
           </Table.Row>
         </Table.Header>

       <Table.Body>
         {Object.keys(varietyData).map(eachNumber => {
           let eachSubVarietyData=varietyData[eachNumber];
           return Object.keys(eachSubVarietyData).map(varietyName => {
             let varietyDetailsObj=eachSubVarietyData[varietyName];
             return (
               <Table.Row>
                 <Table.Cell>
                   <Header as='h4' textAlign='left'>
                     {varietyName}
                   </Header>
                 </Table.Cell>
                 <Table.Cell>{varietyDetailsObj.price}</Table.Cell>
                 <Table.Cell>{varietyDetailsObj.moisture}</Table.Cell>
                 <Table.Cell>{varietyDetailsObj.freight}</Table.Cell>
                 <Table.Cell>{eachNumber}</Table.Cell>
                 <Table.Cell>{varietyDetailsObj.price}</Table.Cell>
                 <Table.Cell>{varietyDetailsObj.moisture}</Table.Cell>
                 <Table.Cell>{varietyDetailsObj.freight}</Table.Cell>
               </Table.Row>
             )
           })
         })}
       </Table.Body>
       </Table>
      )
    })
    return renderTables;
  }

  render() {
    return (
      <div>
       <div style={{marginLeft:20,marginTop:20}}>
          {this.renderSelectField()}
       </div>
        <div style={{margin:20}}>
          {this.renderVarietyTables()}
         </div>
      </div>
    )
  }
}

export default DailyPrices;
