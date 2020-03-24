import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom'
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css'

class NavBar extends Component {

  render() {
      return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to='/'>ThriftRents</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link as={NavLink} to="/create">Create Listing</Nav.Link>
            </Nav>
            <Nav>
              {this.props.user ? (
                <NavDropdown title={this.props.user.givenName} id="basic-nav-dropdown" alignRight>
                  <NavDropdown.Item as={NavLink} to="/my-listings">Manage Listings</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <GoogleLogout
                    clientId="542275019926-pte2khv5ugm3uqoinn3qq30an9k1esq8.apps.googleusercontent.com"
                    buttonText="Logout"
                    onLogoutSuccess={this.props.logout}
                  >
                  </GoogleLogout>
                </NavDropdown>
              ) : (
                <GoogleLogin
                  clientId="542275019926-pte2khv5ugm3uqoinn3qq30an9k1esq8.apps.googleusercontent.com"
                  buttonText="Login"
                  onSuccess={this.props.responseGoogle}
                  onFailure={this.props.responseGoogle}
                  isSignedIn={true}
                  cookiePolicy={'single_host_origin'}
                />
              )}
            </Nav>
        </Navbar>
      )
  }
}

export default NavBar;