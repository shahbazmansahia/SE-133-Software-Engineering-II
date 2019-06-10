import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink } from '../Signup/signup';
import { PasswordForgetLink } from '../PasswordForget/passwordForget';
import { auth } from '../../firebase';
import * as routes from '../../constants/routes';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import logo from '../../images/logo.png';

// This file contains the login screen

const style = {
  textAlign: 'center',
  padding: '1em',
  float: 'center',
  minWidth: "50vh",
};

const midDiv = {
  height: "25%",
  //minHeight: "50vh",
};

const page = {
  height: "100%",
  display: 'flex',
};

const pad = {
  padding: '1em'
};

// the bar variable is the large blue bar at the right on the login page
var bar = {
  height: "100%",
  minHeight: "100vh",
  width: "50%",
  maxWidth: "50vh",
  minWidth: "10vh",
  borderStyle: "solid",
  borderWidth: "1px",
  borderColor: "rgb(224,224,224)",
  backgroundColor: "rgb(0,128,128)",
  textAlign: "center",
  paddingTop: '2em',
  flex: 1,
}

// LoginPage sets up the logo, email ID, Forgot link and the Sign up options

const LoginPage = ({ history }) =>
  <div style={page}>
  <div style={bar}/>
  <div style={style}>
    <div style={midDiv} />
    <img src={logo} alt="logo" className="App-logo"/>
    <LoginForm history={history} />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

// sets the inial states for each of the text fields to empty
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {

  }
 // onSubmit: defines what happens upon ckicking the "login" button
  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doLoginWithEmailAndPassword(email, password)
      .then((user) => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <div style={style}>
        <TextField
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        />
        </div>
        <div style={style}>
        <TextField
          value={password}
          onChange={event => this.setState(byPropKey('password', event.target.value))}
          type="password"
          placeholder="Password"
        />
        </div>
        <Button disabled={isInvalid} type="submit">
          Login
        </Button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}



export default withRouter(LoginPage);

export {
  LoginForm,
};
