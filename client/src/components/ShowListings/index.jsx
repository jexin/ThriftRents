import React from 'react';
import { Link } from 'react-router-dom'
import { CardDeck, Card, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import FilterBar from '../FilterBar';

import './ShowListings.css'

class ShowListings extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      isLoading: true,
      listings: [],
      viewport: {
        width: '100%',
        height: '100vh',
        latitude: 32.863684,
        longitude: -117.224820,
        zoom: 14
      } 
    }

    this.updateListings = this.updateListings.bind(this);
  }

  componentDidMount() {
    axios.get('https://thriftrents.herokuapp.com/listings/')
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

  processBuffer(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);

    bytes.forEach(byte => {
      binary += String.fromCharCode(byte)
    })

    return window.btoa(binary);
  }

  updateListings(updatedListings) {
    this.setState({
      listings: updatedListings
    })
  }

  showListings() {
    return this.state.listings.map(listing => {
      return (
        <Col sm={6} md={4} lg={6} xl={4} key={listing._id} className="mb-3">
          <Card 
            as={Link} 
            to={`/details/${listing._id}`} 
            onMouseEnter={this.cardHoverIn.bind(this, listing._id)}
            onMouseLeave={this.cardHoverOut.bind(this)}
            className="card-link h-100" 
          >
            <Card.Img 
              variant="top" 
              src={`data:image/png;base64,${this.processBuffer(listing.images[0].data)}`} 
              alt="Listing Image"
            />
            <Card.Body>
              <Card.Title className="card-title">
                ${listing.price}/month 
                <span id="listing-type">{listing.type}</span>
              </Card.Title>
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
      let hover = this.state.hovered === listing._id ? 'hover' : '';
      let hovered = this.state.hovered === listing._id ? 'hovered' : '';

      return (
        <Link key={listing._id} to={`/details/${listing._id}`}>
          <Marker 
            longitude={listing.location.coordinates[1]} 
            latitude={listing.location.coordinates[0]} 
            className={hover}
          >
            <div className="popover">
              <p>{listing.title}</p>
              <p className="text-muted">{listing.type}</p>
              <p>{listing.bed} bed | {listing.bath} bath</p>
            </div>
            <div className={`marker-content ${hovered}`}>${listing.price}</div>
          </Marker>
        </Link>
      )
    })
  }

  render() {
    return (
      this.state.isLoading ? (
        <div className="loading">
          <FontAwesomeIcon icon={faSpinner} id="spinner" spin />
        </div>
      ):(
        <>
          <FilterBar updateListings={this.updateListings} />
          <Row id="home-page">
            <Col lg={6} className="mb-2">
              <CardDeck>
                {this.showListings()}
              </CardDeck>
            </Col>
            <Col lg={6} className="mb-2 d-none d-lg-block" id="map">
              <div id="map-box">
                <ReactMapGL 
                  mapStyle='mapbox://styles/mapbox/streets-v11' 
                  mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                  {...this.state.viewport}
                  onViewportChange={(viewport) => this.setState({viewport})}
                  >
                  {this.mapListings()}
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