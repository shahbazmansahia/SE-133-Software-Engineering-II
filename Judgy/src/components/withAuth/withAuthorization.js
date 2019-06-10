import React from 'react';
import { withRouter } from 'react-router-dom';

import AuthUserContext from './AuthUserContext';
import { firebase, db, auth } from '../../firebase';
import * as routes from '../../constants/routes';

// This code deals with the intial user authorization and authentication process
// authorization state == unverified state of user account

const withAuthorization = (authCondition) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      var messaged = false;
      var verified = false;
      var loaded = false;
      firebase.auth.onAuthStateChanged(authUser => {
        if (!authCondition(authUser)) {
          if (authUser) {
            this.props.history.push(routes.HOME);
          } else {
            this.props.history.push(routes.LOGIN);
          }
        }
        if (authUser && !loaded) {
          loaded = true;
          var userId = authUser.uid;
          var username;
          verified = authUser.emailVerified;
          db.onceGetUser(userId).then(function(snapshot) {
            username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
            authUser.updateProfile({
              displayName: username,
              emailVerified: verified,
              //photoURL: "https://example.com/jane-q-user/profile.jpg"
            }).then(function() {
              // Update successful.
              if (!verified) {
                messaged = false;
                auth.doLogout();
                alert("Email is not verified. Please check your email to verify.");
                this.props.history.push(routes.LOGIN);
              }
            }).catch(function(error) {
              // An error happened.
            });
          });
        } else if (authUser && !messaged && !verified) {
          auth.doLogout();
          alert("Email is not verified. Please check your email to verify.");
          this.props.history.push(routes.LOGIN);
        }
      });
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => authUser ? <Component /> : null}
        </AuthUserContext.Consumer>
      );
    }
  }

  return withRouter(WithAuthorization);
}

export default withAuthorization;
