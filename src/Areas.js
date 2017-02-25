import React, { Component } from 'react';
import * as firebase from 'firebase';
import Collapse, { Panel } from 'rc-collapse-icon';
import 'rc-collapse/assets/index.css';
import FaEdit from 'react-icons/lib/fa/edit';
import FaDelete from 'react-icons/lib/fa/trash-o';
import FaSave from 'react-icons/lib/fa/floppy-o';

import AddArea from './AddArea';
import { Modal, Button } from 'react-bootstrap';
import AlertContainer from 'react-alert';



class Areas extends Component {

  constructor(props) {
    super(props);

    this.alertOptions = {
      offset: 20,
      position: 'top right',
      theme: 'light',
      time: 5000,
      transition: 'fade'
    };

    this.state = {
      areas: {},
      showConfirmModal: false,
      showEditModal: false
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

  closeConfirmModal() {
    this.setState({ showConfirmModal: false });
  }

  openConfirmModal() {
    this.setState({ showConfirmModal: true });
  }

  closeEditModal() {
    this.setState({ showEditModal: false });
  }

  openEditModal() {
    this.setState({ showEditModal: true });
  }

  onDeleteArea(areaKey, areaId, e) {
    console.log("AREA TO DELETE: " + areaKey);
    const areasRef = firebase.database().ref().child('areas');
    const areaToRemoveRef = areasRef.child(areaKey);
    areaToRemoveRef.remove(error => {
      if(error){
        this.msg.error(<div className="error">Error while deleting Area <h4>{ areaId }</h4>: { error.message }</div>, {
          time: 2000,
          type: 'error',
        });
      } else {
        this.msg.success(<div className="success"><h4>{ areaId }</h4> is deleted</div>, {
          time: 2000,
          type: 'success',
        });
      }
    });

    this.closeConfirmModal();
  }

  onSaveArea(areaKey, areaId, e) {
    console.log("AREA TO EDIT: " + areaKey);

    this.closeConfirmModal();
  }


  getConfirmModal(areaId, areaKey) {
    return <Modal show={this.state.showConfirmModal} onHide={this.closeConfirmModal.bind(this)}>
      <Modal.Header closeButton>
        <Modal.Title>Delete { areaId } area?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete area <bold>{ areaId }</bold>?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.onDeleteArea.bind(this, areaKey, areaId)}>Delete</Button>
      </Modal.Footer>
    </Modal>;
  }

  getEditModal(areaId, areaKey) {
    return <Modal show={this.state.showEditModal} onHide={this.closeEditModal.bind(this)} bsSize="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit { areaId } area?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddArea />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.onSaveArea.bind(this, areaKey, areaId)}><FaSave /></Button>
      </Modal.Footer>
    </Modal>;
  }

  getAreas() {
    const areasArray = this.state ? this.state.areas : {};
    const areas = [];
    const self = this;

    Object.keys(areasArray).forEach( areaKey => {
      const { areaId, displayName, district, state } = areasArray[areaKey];
      const areaPanelHeader = `${displayName} | ${district} | ${state} | ${areaId}`;
      const confirmModal =  self.getConfirmModal(areaId, areaKey);
      const editModal =  self.getEditModal(areaId, areaKey);


      areas.push(
        <Panel header={ areaPanelHeader } key={ areaId }>
          <div className="actions">
            <div className="action" onClick={ this.openEditModal.bind(this) }><FaEdit /></div>
            <div className="action" onClick={ this.openConfirmModal.bind(this) }><FaDelete /></div>
          </div>
          { confirmModal }
          { editModal }
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
        <AlertContainer ref={ a => this.msg = a} {...this.alertOptions} />
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
