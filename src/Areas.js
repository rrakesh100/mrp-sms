import React, { Component } from 'react';
import * as firebase from 'firebase';
import Collapse, { Panel } from 'rc-collapse-icon';
import 'rc-collapse/assets/index.css';

import AddArea from './AddArea';


class Areas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      areas: {}
    };
  }

  componentDidMount() {
    const areasRef = firebase.database().ref().child('areas');
    areasRef.on('value', snap => {
      this.setState({
        areas: snap.val()
      });
    });
  }

  getAreas() {
    const areasArray = this.state ? this.state.areas : {};

    const areas = [];
    Object.keys(areasArray).forEach( areaKey => {
      const { areaId, displayName, district, state } = areasArray[areaKey];
      const areaPanelHeader = `${displayName} | ${district} | ${state} | ${areaId}`;

      areas.push(
        <Panel header={ areaPanelHeader } key={ areaId }>
          <div className="area">
              <ul>
                <li><label>Aread ID: </label> <span>{ areaId }</span> </li>
                <li><label>Display Name: </label> <span>{ displayName }</span></li>
                <li><label>District: </label> <span>{ district }</span></li>
                <li><label>State: </label> <span>{ state }</span></li>
              </ul>
          </div>
        </Panel>
      );
    });
    return areas;
  }

  render() {

    return (
      <div className="agents">
        <Collapse >
          <Panel header="Add a new Area" key="new-area" className="add-area" showArrow="false">
            <AddArea />
          </Panel>
        </Collapse>

        <Collapse>
            { this.getAreas() }
        </Collapse>

      </div>
    );

  }

}

export default Areas;
