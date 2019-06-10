import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../../firebase';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

// in case user forgets password, this shall help reset it

const style = {
  textAlign: 'center',
  padding: '1em',
  float: 'center',
  minWidth: "50vh",
};

const PasswordForgetPage = () =>
  <div style={style}>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

// sets intial state of email ID text field

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      error,
    } = this.state;

    const isInvalid = email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          value={this.state.email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        />
        <Button disabled={isInvalid} type="submit">
          Reset My Password
        </Button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

// generates hyperlink got forgot password option

const PasswordForgetLink = () =>
  <p>
    <Link to="/pw-forget">Forgot Password?</Link>
  </p>

export default PasswordForgetPage;

export {
  PasswordForgetForm,
  PasswordForgetLink,
};
