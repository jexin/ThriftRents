import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
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

    this.state = { user: '' }
  }

  responseGoogle = (response) => {
    this.setState({
      user: response.profileObj
    })
  }

  logout = () => {
    this.setState({
      user: ''
    })
  }

  render() {
    return (
      <div>
        <Router>
          <Navbar responseGoogle={this.responseGoogle} logout={this.logout} user={this.state.user} />
          <Route path="/" exact component={ShowListings} />
          <Route path="/details/:id" render={(props) => <ViewListing {...props} user={this.state.user} />} />
          <Route path="/edit/:id" render={(props) => <ListingForm {...props} edit={true} user={this.state.user} />} />
          <Route path="/create" render={(props) => <ListingForm {...props} edit={false} user={this.state.user} />} />
          <Route path="/my-listings" render={(props) => <MyListings {...props} user={this.state.user} />} />
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;
