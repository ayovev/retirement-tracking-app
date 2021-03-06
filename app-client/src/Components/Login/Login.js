import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
// posibly swap out md5 for crypto package later on for more robust encryption
import md5 from "md5";
import { AuthenticationContext } from "../../Contexts/AuthenticationContext/AuthenticationContext";
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ``,
      password: ``
    };
  }

  // might need to have more validation here but it's a start
  validateForm = () => {
    return this.state.email.length > 6 && this.state.password.length > 6;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      email: this.state.email,
      password: md5(this.state.password)
    };

    const config = {
      method: `POST`,
      mode: `cors`,
      headers: {
        'accept': `application/json`,
        'content-type': `application/json`
      },
      credentials: `include`,
      body: JSON.stringify(data)
    };

    const response = await fetch(`/api/login`, config);

    /* eslint indent: ["error", 2, { "SwitchCase": 1 }]*/
    switch (response.status) {
      case 401:
        alert(`Incorrect Credentials`);
        break;
      case 404:
        alert(`User Does Not Exist`);
        break;
      case 200:
        this.context.login();
        break;
      default:
        alert(`Unkown Error ${response.status}`);
        break;
    }
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              value={this.state.email}
              onChange={this.handleChange}
              type="email"
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit">
            Login
          </Button>
        </form>
      </div>
    );
  }
}

Login.contextType = AuthenticationContext;
