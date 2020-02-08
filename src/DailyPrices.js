import React from 'react';
import * as firebase from 'firebase';
import { Header, Table, Rating,Select } from 'semantic-ui-react'

class DailyPrices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dailyPriceData: null
    };
  }

  fetchConstituencies() {
    let constituencyOptions=[];
    const constituencyPath = `constituency`;
    const constituencyRef = firebase.database().ref().child(constituencyPath);
    constituencyRef.on('value', snap => {
      const constituencyData = snap.val();
      console.log(constituencyData);
      this.setState({
        constituencyData
      })
    })
  }

  fetchDailyPrices() {
    const dailyPricePath = `dailyPrices`;
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

  render() {
    const {constituencyData,dailyPriceData}=this.state;
    console.log(constituencyData);
    console.log(dailyPriceData);
    return (
      <div>
       <div>
          <Select placeholder='Select your country' options={constituencyData} />
       </div>
        <div>
          <Table celled padded>
           <Table.Header>
             <Table.Row>
               <Table.HeaderCell singleLine>Paddy</Table.HeaderCell>
               <Table.HeaderCell>Price</Table.HeaderCell>
               <Table.HeaderCell>Moisture</Table.HeaderCell>
               <Table.HeaderCell>Freight</Table.HeaderCell>
               <Table.HeaderCell>Price</Table.HeaderCell>
             </Table.Row>
           </Table.Header>

         <Table.Body>
           <Table.Row>
             <Table.Cell>
               <Header as='h2' textAlign='center'>
                 A
               </Header>
             </Table.Cell>
             <Table.Cell singleLine>Power Output</Table.Cell>
             <Table.Cell>
               <Rating icon='star' defaultRating={3} maxRating={3} />
             </Table.Cell>
             <Table.Cell textAlign='right'>
               80% <br />
               <a href='#'>18 studies</a>
             </Table.Cell>
             <Table.Cell>
             Hello
             </Table.Cell>
           </Table.Row>
         </Table.Body>
         </Table>
         </div>
      </div>
    )
  }
}

export default DailyPrices;
