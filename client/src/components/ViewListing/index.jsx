import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Figure, Modal, Button, Image, Popover, OverlayTrigger, Carousel, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

import instagram from '../../assets/instagram.png';
import snapchat from '../../assets/snap.png';
import wechat from '../../assets/wechat.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faTwitterSquare, faRedditSquare } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faEnvelope, faSpinner } from '@fortawesome/free-solid-svg-icons';

import ReactMapGL, {Marker} from 'react-map-gl';

import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4'
import { SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';

import './ViewListing.css'

class ViewListing extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      isLoading: true,
      listings: [],
      listing: '',
      images: [''],
      contact: '',
      show: false,
      columns: [
        { name: "room", title: "Room" },
        { name: "name", title: "Name" },
        { name: "tags", title: "Tags" }
      ],
      rows: [],
      viewport: {
        width: '100%',
        height: '100%',
        latitude: 32.8698846,
        longitude: -117.23511310000004,
        zoom: 14
      }
    }

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  componentDidMount() {
    axios.get('https://thriftrents.herokuapp.com/listings/')
      .then(res => {
        this.setState({ 
          listings: res.data 
        })
      })
      .catch((err) => { 
        console.log(err) 
      })

    axios.get(`https://thriftrents.herokuapp.com/listings/${this.props.match.params.id}`)
      .then(res => {
          this.setState(prevState => ({
            isLoading: false,
            listing: res.data,
            images: res.data.images,
            contact: res.data.contact,
            rows: res.data.rows,
            viewport: {                   
              ...prevState.viewport,    
              latitude: res.data.location.coordinates[0],
              longitude: res.data.location.coordinates[1]    
            }
        }))
      })
      .catch((err) => { 
        console.log(err) 
      })
  }

  deleteExercise() {
    axios.delete(`https://thriftrents.herokuapp.com/listings/${this.props.match.params.id}`)
      .then(res => {
        this.setState({
          listings: this.state.listings.filter(el => el._id !== this.props.match.params.id)
        })

        window.location = '/';
      })
      .catch((err) => { 
        console.log(err) 
      })
  }

  loadImages() {
    return this.state.images.map((image, i) => {
      return (
        <Carousel.Item key={i}>
          <Image
            className="d-block w-100"
            src={`data:image/png;base64,${this.processBuffer(image.data)}`}
            alt="Image"
          />
        </Carousel.Item>
      )
    })
  }

  distance(lat1, lon1, lat2, lon2) {
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    }
    else {
      let radlat1 = Math.PI * lat1/180;
      let radlat2 = Math.PI * lat2/180;
      let theta = lon1-lon2;
      let radtheta = Math.PI * theta/180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      return dist.toFixed(2);
    }
  }

  handleClose() {
    this.setState({
      show: false
    })
  }

  handleShow() {
    this.setState({
      show: true
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

  render() {
    const popover = (
      <Popover>
        <Popover.Content>
          {this.state.contact.wechat}
        </Popover.Content>
      </Popover>
    );

    const tableColumnExtensions = [
      { columnName: 'room', width: '20%' },
      { columnName: 'name', width: '20%' },
      { columnName: 'tags', width: '60%' }
    ];

    const sorting = [{ columnName: 'room', direction: 'asc' }];

    const listing = this.state.listing;

    return (
      this.state.isLoading ? (
        <div className="loading">
          <FontAwesomeIcon icon={faSpinner} id="spinner" spin />
        </div>
      ):(
        <Container>
          <Row className="mt-3">
            <Col md={7}>
              <Carousel>
                {this.loadImages()}
              </Carousel>
            </Col>
            <Col md={5}>
              <h5><b>{listing.title}</b></h5>
              <p className="text-muted passed-time">
                Posted {moment(listing.createdAt).fromNow()}
              </p>   
              <p>${listing.price} / month</p>
              <p> {listing.type}</p>
              <p>{listing.bed} bed | {listing.bath} bath</p>
              <p><b>Lease term</b>: {listing.term && listing.term.join(', ')}</p>
              <p><b>Lease tength</b>: {listing.length}</p>
              <p><b>Start-End dates</b>: {moment(listing.start).format('L')} - {moment(listing.end).format('L')}</p>
              {(listing.userId === '' || listing.userId === this.props.user.googleId) && (
                <>
                  <Button as={NavLink} to={`/edit/${listing._id}`} variant="warning" className="mr-2">Edit</Button>
                  <Button onClick={() => this.deleteExercise()} variant="danger">Delete</Button>
                </>
              )}
            </Col>
          </Row>

          <Row>
            <Col md={8}>
              <p>{listing.description}</p>      
              <p><b>What's included</b>: {listing.included && listing.included.join(", ")}</p>
              <p><b>Gender</b>: {listing.gender}</p>
              <p><b>Housemates/Roommates</b>: </p>
              <Grid
                rows={this.state.rows}
                columns={this.state.columns}>
                <SortingState sorting={sorting} />
                <IntegratedSorting />
                <Table columnExtensions={tableColumnExtensions} />
                <TableHeaderRow />
              </Grid>
            </Col>
            <Col md={4}>
              <ReactMapGL 
                mapStyle='mapbox://styles/mapbox/streets-v11' 
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                {...this.state.viewport}
                onViewportChange={(viewport) => this.setState({viewport})}
              >
                {listing.location && (
                  <Marker 
                    latitude={listing.location.coordinates[0]} 
                    longitude={listing.location.coordinates[1]} 
                    className="marker" 
                  />
                )}
              </ReactMapGL>
              <p>
                {listing.location && (
                  this.distance(
                    listing.location.coordinates[0], 
                    listing.location.coordinates[1], 
                    32.8801, 
                    -117.2340)
                )} 
                {' '} miles from campus
              </p>
            </Col>
          </Row>

          <Button variant="primary" onClick={this.handleShow} className="mb-2">Contact</Button>

          <Modal show={this.state.show} onHide={this.handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Contact Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.state.contact.instagram !== '' && (
                <a href={`https://www.instagram.com/${this.state.contact.instagram}`} target="_blank" rel="noopener noreferrer">
                  <Figure.Image src={instagram} />
                </a>
              )}
              {this.state.contact.facebook !== '' && (
                <a href={`http://m.me/${this.state.contact.facebook}`} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebookSquare} id="facebook" />
                </a>
              )}
              {this.state.contact.twitter !== '' && (
                <a href={`https://www.twitter.com/${this.state.contact.twitter}`} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTwitterSquare} id="twitter" />
                </a>
              )}
              {this.state.contact.reddit !== '' && (
                <a href={"https://www.reddit.com/message/compose/?to=" + this.state.contact.reddit + "&subject=Interested%20in%20ThriftRents%20listing&message=Hi%2C%0A%0AI'm%20interested%20in%20your%20listing%20for%20" + listing.title + "."} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faRedditSquare} id="reddit" />
                </a>
              )}
              {this.state.contact.snapchat !== '' && (
                <a href={`https://www.snapchat.com/add/${this.state.contact.snapchat}`} target="_blank" rel="noopener noreferrer">
                  <Figure.Image src={snapchat} />
                </a>
              )}
              {this.state.contact.wechat !== '' && (
                <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
                  <Figure.Image src={wechat}/>
                </OverlayTrigger>
              )}
              {this.state.contact.phone !== '' && (
                <a href={"tel:" + this.state.contact.phone}>
                  <FontAwesomeIcon icon={faPhone} id="phone" />
                </a>
              )}
              {this.state.contact.email !== '' && (
                <a href={"mailto:" + this.state.contact.email + "?subject=Interested%20in%20ThriftRents%20listing&body=Hi%2C%0A%0AI'm%20interested%20in%20your%20listing%20for%20" + listing.title + "."}>
                  <FontAwesomeIcon icon={faEnvelope} id="email" />
                </a>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </Container>
      )
    )
  }
}

export default ViewListing;