import React, { Component } from 'react';
import * as firebase from 'firebase';
import Collapse, { Panel } from 'rc-collapse-icon';
import 'rc-collapse/assets/index.css';
import AddAgent from './AddAgent';
import Agent from './Agent';


class Agents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agents: {}
    };
  }

  componentDidMount() {
    const agentsRef = firebase.database().ref().child('agents');
    agentsRef.on('value', snap => {
      this.setState({
        agents: snap.val()
      });
    })
  }

  getAgents() {
    const agentsArray = this.state ? this.state.agents : {};

    const agents = [];
    Object.keys(agentsArray).forEach( agentKey => {
      console.log("AGENT KEY: " + agentKey);
      agents.push(
        <Panel header={ agentsArray[agentKey].name } key={ agentKey }>
          <Agent agentKey={ agentKey } />
        </Panel>
      );
    });
    return agents;
  }

  render() {
    return (
      <div className="agents">
        <Collapse >
          <Panel header="Add a new Agent" key="new-agent" className="add-panel" showArrow="false">
            <AddAgent />
          </Panel>
        </Collapse>

        <Collapse>
            { this.getAgents() }
        </Collapse>

      </div>
    );
  }

}

export default Agents;
