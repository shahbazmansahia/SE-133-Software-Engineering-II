import React, { Component } from 'react';

import AuthUserContext from '../../components/withAuth/AuthUserContext';
import withAuthorization from '../../components/withAuth/withAuthorization';
import { db } from '../../firebase';

// admin rules/ view; for users with admin priveleges

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
    };
  }

  componentDidMount() {
    db.onceGetUsers().then(snapshot =>
      this.setState(() => ({ users: snapshot.val() }))
    );
  }

  render() {
    const { users } = this.state;

    return (
    <AuthUserContext.Consumer>
      {authUser =>
        <div>
          <h1>Admin</h1>
          <p>Restricted area! Only users with the admin rule are authorized.</p>
          { !!users && <UserList users={users} /> }
        </div>
      }
    </AuthUserContext.Consumer>
    );
  }
}

const UserList = ({ users }) =>
  <div>
    <h2>List of Usernames of Users</h2>
    <p>(Saved on Sign Up in Firebase Database)</p>

    {Object.keys(users).map(key =>
      <div key={key}>{users[key].username}</div>
    )}
  </div>

const authCondition = (authUser) => (!!authUser && authUser.uid === "PbcbR94AdpYZDIusA1YoAzIDJkj1");

export default withAuthorization(authCondition)(AdminPage);
