import React, { Component } from 'react';
import * as firebase from 'firebase';
import Collapse, { Panel } from 'rc-collapse-icon';
import 'rc-collapse/assets/index.css';
import Outlet from './Outlet';
import AddOutlet from './AddOutlet';

class Agent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      agentKey: this.props.agentKey
    };
  }

  componentDidMount() {
    const agentDataPath = `agents/${this.state.agentKey}`;
    const agentRef = firebase.database().ref().child(agentDataPath);
    agentRef.on('value', snap => {
      this.setState({
        data: snap.val()
      });
    });
  }

  showAgentDetails() {
    const { name, mobile, area } = this.state.data;
    const imageUrl = 'https://mrps-orderform.firebaseapp.com/defaultAgentImg.png';
    return (
      <div>
        <div className="product">
          <div className="left">
            <img src={ imageUrl } alt={ name }/>
          </div>
          <div className="right">
            <ul>
              <li><label>AgentName: </label> <span>{ name }</span> </li>
              <li><label>Mobile: </label> <span>{ mobile }</span></li>
              <li><label>Area: </label> <span>{ area }</span></li>
            </ul>
          </div>
        </div>
        <div>
          { this.showOutlets() }
        </div>
      </div>
    );
  }

  showOutlets() {
    const noOfOutlets = this.state.data.outlets ? Object.keys(this.state.data.outlets).length : 0;
    return (
      <div>
        <h4>{ `Outlets [${noOfOutlets}]` }</h4>
        <Collapse>
          { this.getOutlets() }
        </Collapse>
      </div>
    );
  }

  getOutlets() {
    const outletsArray = this.state ? this.state.data.outlets : {};
    const outlets = [];

    Object.keys(outletsArray).forEach( index => {
      const element = outletsArray[index];
      outlets.push(
        <Panel header={ element.name } key={ element.shopId } className="product-panel" showArrow="true">
          <Outlet data={ element }/>
        </Panel>
      );
    });

    //add outlet Panel
    outlets.push (
      <Panel header="Add a new Outlet" key="new-outlet" className="add-panel" showArrow="false">
        <AddOutlet agentKey={ this.state.agentKey }/>
      </Panel>
    );

    return outlets;
  }

  render() {
    const agentName = this.state.data ? this.state.data.name : '';
    console.log("AGENT NAME: " + agentName);
    if(!agentName) {
      return null;
    }
    return (
      <div>
        { this.showAgentDetails() }
      </div>
    );
  }
}

Agent.propTypes = {
  agentKey: React.PropTypes.string.isRequired
}

export default Agent;
