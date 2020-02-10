import React from 'react';
import * as firebase from 'firebase';
import { Header, Table, Rating, Button } from 'semantic-ui-react'
import moment from 'moment';
import {
    Resizable,
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    BarChart,
    styler,
    Baseline
  } from "react-timeseries-charts";
import { TimeSeries, Index } from "pondjs";

class DailyPrice extends React.Component {

    state = {
        constituencyData : [],
        data : {
            values: [
              ["2017-01-24T00:00", 0.01],
              ["2017-01-24T01:00", 0.13]
            ]
        },
        min : 0,
        max : 200
    }
    
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.getConstituencyData();
        this.getDailyPricesData();
    }

    getAgentPrice = dailyPriceData => {
        var agentPrices = [];
        getPrices(dailyPriceData);
        function getPrices(data){
            for(var key in data){
                if(key == "agentPrice"){
                    let obj = data[key];
                    for(var key in obj){
                        obj = obj[key];
                        break;
                    }
                    agentPrices.push(obj);
                }
                if(typeof data[key] == "object"){
                    getPrices(data[key]);
                }
            }
        }
        console.log(agentPrices);
        var data = {
            values : []
        };
        console.log(agentPrices, "AAADATEEEEEEEEEEE");
        var min = 0, max = 0;
        agentPrices.forEach(item => {
            var date = item["date"] || "10-02-2020";
            date = date.split("-")[2] + "-" + date.split("-")[1] + "-" + date.split("-")[0];
            date += "T00:00";
            console.log(date,"DATEEEEEEEEEEE");
            data.values.push([ date, item["price"] ]);
            if(item.price < min)
                min = item.price;
            if(item.price > max)
                max = item.price;
        });
        console.log(data, "DATA");
        data.values.push([ "2020-02-11T00:00", 60]);
        data.values.push([ "2020-02-12T00:00", 120]);
        data.values.push([ "2020-02-13T00:00", 150]);
        data.values.push([ "2020-02-14T00:00", 180]);
        data.values.push([ "2020-02-15T00:00", 60]);
        data.values.push([ "2020-02-16T00:00", 120]);
        data.values.push([ "2020-02-17T00:00", 150]);
        data.values.push([ "2020-02-18T00:00", 180]);
        this.setState({ data, min, max });
    }

    getDailyPricesData = () => {
        const dailyPricePath = `/dailyPricesAdmin`;
        const dailyPriceRef = firebase.database().ref().child(dailyPricePath);
        dailyPriceRef.on('value', data => {
            const dailyPriceData = data.val();
            console.log(dailyPriceData);
            this.setState({
                dailyPriceData
            });
            this.getAgentPrice(dailyPriceData);
        })
    }

    getConstituencyData = () => {
        const constituencyRef = firebase.database().ref().child("/constituency");
        constituencyRef.on('value', data => {
            var cData = data.val();
            console.log(cData);
            var constituencyData = [];
            for(var key in cData)
                constituencyData.push(cData[key]);
            this.setState({
                constituencyData
            });
        })
    }

    renderGraph = () => {
        const series = new TimeSeries({
            name: "Prices",
            columns: ["index", "precip"],
            points: this.state.data && this.state.data.values.map(([d, value]) => {
                console.log(d, "DDDDDDDD");
                return [
                    new Date(d).toISOString(),
                    value
                ]
            })
          });
      
          console.log("series is ", series);
          const style = styler([
            {
              key: "precip",
              color: "#A5C8E1",
              selected: "#2CB1CF"
            }
          ]);
        return (
            <Resizable>
                <ChartContainer timeRange={series.range()}>
                <ChartRow height="150">
                    <YAxis
                    id="rain"
                    label="Rainfall (inches/hr)"
                    min={this.state.min}
                    max={200 || this.state.max}
                    format=".2f"
                    width="70"
                    type="linear"
                    />
                    <Charts>
                    <BarChart
                        axis="rain"
                        style={style}
                        spacing={1}
                        columns={["precip"]}
                        series={series}
                        minBarHeight={1}
                    />
                    {/* <Baseline axis="price" style={{}} value={series.avg() - series.stdev()}/> */}
                    </Charts>
                </ChartRow>
                </ChartContainer>
            </Resizable>
        )
    }

    render(){
        // console.log(this.state.constituencyData, "Constituency Data");
        return (
            <div>
                {
                    this.state.constituencyData && this.state.constituencyData.length > 0 && (
                        <div>
                            <select onChange={e => {
                                    this.setState({ selectedConstituency : JSON.parse(e.target.value) });
                                }}>
                                <option> Please select a constituency </option>
                                {
                                        this.state.constituencyData.map((item, index) => {
                                            return (<option key={index} value={JSON.stringify(item)}>
                                                { item.name }
                                            </option>)
                                        })
                                }
                            </select>
                        </div>
                    )
                }

                {
                    this.state.selectedConstituency && this.state.selectedConstituency.variety && (
                        <div>
                            <select onChange={e => {
                                this.setState({ selectedVariety : JSON.parse(e.target.value) });
                            }}>
                                <option> Please select a constituency </option>
                                {
                                        this.state.selectedConstituency.variety.map((item, index) => {
                                            return (<option key={index} value={JSON.stringify(item)}>
                                                { item.name }
                                            </option>)
                                        })
                                }
                            </select>
                        </div>
                    )
                }   

                {
                    this.state.selectedVariety && this.state.selectedVariety.item && (
                        <div>
                            <select onChange={e => {
                                this.setState({ selectedItem : JSON.parse(e.target.value) });
                            }}>
                                <option> Please select a constituency </option>
                                {
                                        this.state.selectedVariety.item.map((item, index) => {
                                            return (<option key={index} value={JSON.stringify(item)}>
                                                { item.name }
                                            </option>)
                                        })
                                }
                            </select>
                        </div>
                    )
                }   
                {
                    this.state.selectedItem && (
                        <button onClick={e => {
                            this.showGraph();
                        }}>
                            Show Graph
                        </button>
                    )
                }
                
                {
                    this.renderGraph()
                }

            </div>
        )
    }

}

export default DailyPrice;