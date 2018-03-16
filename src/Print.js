import React, { Component, PropTypes } from 'react';
import { connectProfile } from './auth';
import './Print.css';



class Print extends Component {

  static propTypes = {
    ...connectProfile.PropTypes,
    children: PropTypes.any
  };


  render() {
    return (
      <div className="printer">
        { this.props.children }
      </div>
    );
  }

}

export default connectProfile(Print);
