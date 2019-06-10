import React, { Component } from 'react';
import { HashRouter as Redirect } from "react-router-dom";
import logo from '../../images/logo.png';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';

// this code is executed as soon as the user logs in
// the home page is set as the default go-to right after the login 

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: "0em",
    marginRight: "0em",
    width: 400,
  },
  menu: {
    width: 200,
  },
  text: {
    fontSize: '1em',
  },
};

class Landing extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      verified: false,
    };
  }

  handleClick(e) {
    if (this.state.username === "user" && this.state.password === "password") {
      this.setState({verified: true});
    }
  }

  onChangeField(e) {
    if (e.target.id === "username"){
      this.setState({username: e.target.value});
    } else if (e.target.id === "password") {
      this.setState({password: e.target.value});
    }
    console.log(e.target.id);
  }

  render() {
    if (this.state.verified) {
      this.setState({verified: false});
      return <Redirect to="/home" />;
    }

    return (
      <div className="landing">
        <Redirect from="/" to="/login" />
        <img src={logo} alt="logo" className="App-logo"/>
        <form className={styles.container}>
          <div>
            <TextField
              id="username"
              label="Username"
              defaultValue=""
              style={styles.textField}
              margin="normal"
              onChange={this.onChangeField.bind(this)}
            />
          </div>
          <div>
            <TextField
              id="password"
              label="Password"
              defaultValue=""
              style={styles.textField}
              margin="normal"
              onChange={this.onChangeField.bind(this)}
            />
          </div>
            <p style={styles.text}>
             <a href="https://my.sjsu.edu/">Forgot password?</a>
            </p>
        </form>
        <Button variant="raised" onClick={this.handleClick.bind(this)} >Sign in</Button>
        <p></p>
        <div>
        <Divider/>
        </div>
        <p style={styles.text}>
              Not a user? <a href="https://my.sjsu.edu/">Register here</a>
        </p>
      </div>
    );
  }
}

export default Landing;
