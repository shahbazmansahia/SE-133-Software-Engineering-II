import React, { Component } from 'react';
import logo from '../../images/logo.png';
import Sidebar from '../../components/sidebar/sidebar';

import AuthUserContext from '../../components/withAuth/AuthUserContext';
import withAuthorization from '../../components/withAuth/withAuthorization';
import { db } from '../../firebase';

// The home page view; renders logo, welcome text and is supposed to show
// the list of competitions that the user signed up for

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { users } = this.state;

    return (
      <div className="page-centered">
        <Sidebar/>
        <div style={{flexGrow: 1}}>
        <img src={logo} alt="logo" className="App-logo"/> //inserts logo image
        <p>This is the home page!</p>                     // inserts subtext
        <p>The Home Page is accessible by every signed in user.</p> // more subtext
        </div>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Home);
