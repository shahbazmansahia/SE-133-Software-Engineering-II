import React, { Component } from 'react';
import AuthUserContext from '../../components/withAuth/AuthUserContext';
import withAuthorization from '../../components/withAuth/withAuthorization';
import { db } from '../../firebase';

class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  //To get data from the user, you need to call db.
  //The path is set to /users/ and adds on to that

  //var userId = authUser.uid;
  //var data;
  //db.onceGetData(PUT PATH HERE).then(function(snapshot) { data = (snapshot.val() && snapshot.val().DATA_NAME) || 'Anonymous';

  //For example `userId` and `snapshot.val().username` would get the user's username from the database.
  //The path you would enter would be `userId` and the desired data is `username`. The method would then call `/users/username`

  //the flexgrow div is where youo put the page's content in
  //AuthUserContext.Consumer is for getting data from the user profile already loaded in (email, displayName, uid, etc.) not from the database

  render() {
    return (
      <div className="page-centered">
        <Sidebar/>
        <div style={{flexGrow: 1}}>
          Content
          <AuthUserContext.Consumer>
            {authUser =>
              {authUser.email}
            }
          </AuthUserContext.Consumer>
        </div>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Template);

