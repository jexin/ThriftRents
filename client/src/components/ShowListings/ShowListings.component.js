import React, { Component } from 'react';
import { CardDeck, Card, Col, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
import FilterBar from '../FilterBar/FilterBar.component';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ShowListings.css'

class ShowListings extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      isLoading: true,
      listings: [],
      hovered: '',
      viewport: {
        width: '100%',
        height: '100vh',
        latitude: 32.863684,
        longitude: -117.224820,
        zoom: 14
      } 
    }
  }

  componentDidMount() {
    axios.get('http://localhost:5000/listings/')
      .then(res => {
        this.setState({ 
          isLoading: false,
          listings: res.data
        })
      })
      .catch((err) => { 
        console.log(err) 
      })
  }

  cardHoverIn(id, e) {
    this.setState({
      hovered: id
    })
  }

  cardHoverOut() {
    this.setState({
      hovered: ''
    })
  }

  processBuffer( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  updateListings = updatedListings => {
    this.setState({
      listings: updatedListings
    })
  }

  showListings() {
    return this.state.listings.map(listing => {
      return (
        <Col sm={6} md={4} lg={6} xl={4} key={listing._id} className="link mb-3">
          <Card as={NavLink} to={'/details/'+ listing._id} className="h-100" 
              onMouseEnter={this.cardHoverIn.bind(this, listing._id)}
              onMouseLeave={this.cardHoverOut.bind(this)}>
            <Card.Img variant="top" src={"data:image/png;base64," + this.processBuffer(listing.images[0].data)} />
            <Card.Body className="body">
              <Card.Title className="card-title">${listing.price}/month <span id="type">{listing.type}</span></Card.Title>
              <Card.Text>{listing.title}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Posted {moment(listing.createdAt).fromNow()}</small>
            </Card.Footer>
          </Card>          
        </Col>
      )
    })
  }

  mapListings() {

    return this.state.listings.map(listing => {
      let hover = this.state.hovered === listing._id && 'hover';
      let hovered = this.state.hovered === listing._id && 'hovered';

      return (
        <NavLink key={listing._id} to={'/details/'+ listing._id}>
          <Marker longitude={listing.location.coordinates[1]} latitude={listing.location.coordinates[0]} className={hover}>
              <div id="popover">
                <p>{listing.title}</p>
                <p className="text-muted">{listing.type}</p>
                <p>{listing.bed} bed | {listing.bath} bath</p>
              </div>
              <div className={`marker-content ${hovered}`}>${listing.price}</div>
          </Marker>
        </NavLink>
      )
    })
  }

  render() {

      return (
        this.state.isLoading ? (
          <div id="loading">
            <FontAwesomeIcon icon={faSpinner} id="spinner" spin />
          </div>
        ):(
        <>
        <FilterBar updateListings={this.updateListings} />
        <Row id="home">
          <Col>
            <CardDeck>
              { this.showListings() }
            </CardDeck>
          </Col>
          <Col lg={6} className="d-none d-lg-block" id="map">
            <div id="map-box">
              <ReactMapGL mapStyle='mapbox://styles/mapbox/streets-v11' mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
                {...this.state.viewport}
                onViewportChange={(viewport) => this.setState({viewport})}>
                  { this.mapListings() }
                <div id="map-controls">
                  <NavigationControl />
                </div>
              </ReactMapGL>
            </div>
          </Col>
        </Row>
        </>
      )
      )
  }
}

export default ShowListings;