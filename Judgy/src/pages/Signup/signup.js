import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { auth, db } from '../../firebase';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

// deals with the case where a user has to register for the Judgy platform

const style = {
  textAlign: 'center',
  padding: '1em',
  float: 'center',
  minWidth: "50vh",
};

// renders the stlye and description of the sign up page

const SignUpPage = ({ history }) =>
  <div style={style}>
    <h1>SignUp</h1>
    <SignUpForm history={history} />
    <div>Enter a valid email and password.</div>
    <div>Passwords must be at least 8 characters.</div>
  </div>

// sets initial state of text fields to be filled out for registration to empty

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};


class CustomError extends Error {};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne,
    } = this.state;

    var success = false;
    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your own accessible Firebase Database too
        db.doCreateUser(authUser.uid, username, email)
          .then((user) => {
            this.setState(() => ({ ...INITIAL_STATE }));
            if (authUser) {
              authUser.sendEmailVerification().then(function() {
                // Email sent.
                success = true;
               }, function(error) {
                // An error happened./
                this.setState(byPropKey('error', error));
               });
            }
            auth.doLogout();
            //history.push(routes.HOME);
          })
          .catch(error => {
            this.setState(byPropKey('error', error));
          });
        })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });
    if (success) {
      const error = new CustomError();
      error.message = "Success! Please check your email to finish verification.";
      this.setState(byPropKey('error', error));
    }
    event.preventDefault();
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    // defines case where the password entered does not match or fields are left empty

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '' ||
      passwordOne.length < 8;

    return (

      <form onSubmit={this.onSubmit} >
        <TextField
          value={username}
          onChange={event => this.setState(byPropKey('username', event.target.value))}
          type="text"
          placeholder="Full Name"
        />
        <div/>
        <TextField
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        />
        <div/>
        <TextField
          value={passwordOne}
          onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
          type="password"
          placeholder="Password"
        />
        <div/>
        <TextField
          value={passwordTwo}
          onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
          type="password"
          placeholder="Confirm Password"
        />
        <div/>
        <Button disabled={isInvalid} type="submit">
          Sign Up
        </Button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to="/signup">Sign Up</Link>
  </p>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
};
