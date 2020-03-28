import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from './components/NavBar';
import ShowListings from './components/ShowListings';
import ViewListing from './components/ViewListing';
import ListingForm from './components/ListingForm';
import MyListings from './components/MyListings';
import Footer from './components/Footer';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      user: '',
      owner: '' 
    }

    this.responseGoogle = this.responseGoogle.bind(this);
    this.logout = this.logout.bind(this);
    this.changeOwner = this.changeOwner.bind(this);
    this.PrivateRoute = this.PrivateRoute.bind(this);
  }

  responseGoogle(response) {
    this.setState({
      user: response.profileObj
    })
  }

  logout() {
    this.setState({
      user: ''
    })
  }

  changeOwner(googleId) {
    this.setState({
      owner: googleId
    })
  }
  
  PrivateRoute({ component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          (this.state.user.googleId === this.state.owner || this.state.user === this.state.owner) ? (
            <Component {...props} edit={true} user={this.state.user} />
          ) : (
            <Redirect to={`/details/${props.match.params.id}`} />
          )
        }
      />
    );
  }

  render() {
    return (
      <div>
        <Router>
          <Navbar responseGoogle={this.responseGoogle} logout={this.logout} user={this.state.user} />
          <Route path='/' exact component={ShowListings} />
          <Route path='/details/:id' render={(props) => <ViewListing {...props} user={this.state.user} changeOwner={this.changeOwner} />} />
          <this.PrivateRoute path='/edit/:id' component={ListingForm} />
          <Route path='/create' render={(props) => <ListingForm {...props} edit={false} user={this.state.user} />} />
          <Route path='/my-listings' render={(props) => <MyListings {...props} user={this.state.user} />} />
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;
