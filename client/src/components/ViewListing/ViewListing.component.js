import React, { Component } from 'react';
import { Container, Figure, Modal, Button, Image, Popover, OverlayTrigger, Carousel, Col, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import instagram from './instagram.png';
import snapchat from './snap.png';
import wechat from './wechat.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookSquare, faTwitterSquare, faRedditSquare } from '@fortawesome/free-brands-svg-icons'
import { faPhone, faEnvelope, faSpinner } from '@fortawesome/free-solid-svg-icons'
import ReactMapGL, {Marker} from 'react-map-gl';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4'
import { SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import './ViewListing.css'

class ViewListing extends Component {
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
        this.setState({ listings: res.data })
      })
      .catch((err) => { 
        console.log(err) 
      })

    axios.get('https://thriftrents.herokuapp.com/listings/' + this.props.match.params.id)
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
    axios.delete('https://thriftrents.herokuapp.com/listings/' + this.props.match.params.id)
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
    return this.state.images.map((image,i) => {
      return (
        <Carousel.Item key={i}>
          <Image
            className="d-block w-100"
            src={"data:image/png;base64," + this.processBuffer(image.data)}
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
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
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

  processBuffer( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  render() {
    const popover = (
      <Popover id="popover-basic">
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

    return (
      this.state.isLoading ? (
        <div id="loading">
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
              <h5><b>{this.state.listing.title}</b></h5>
              <p className="text-muted passed-time">Posted {moment(this.state.listing.createdAt).fromNow()}</p>   
              <p>${this.state.listing.price} / month</p>
              <p> {this.state.listing.type}</p>
              <p>{this.state.listing.bed} bed | {this.state.listing.bath} bath</p>
              <p><b>Lease term</b>: {this.state.listing.term && this.state.listing.term.join(', ')}</p>
              <p><b>Lease tength</b>: {this.state.listing.length}</p>
              <p><b>Start-End dates</b>: {moment(this.state.listing.start).format('L')} - {moment(this.state.listing.end).format('L')}</p>
              {(this.state.listing.userId === '' || this.state.listing.userId === this.props.user.googleId) && (
                <>
                  <Button as={NavLink} to={'/edit/'+ this.state.listing._id} variant="warning" className="mr-2">Edit</Button>
                  <Button onClick={() => this.deleteExercise()} variant="danger">Delete</Button>
                </>
              )}
            </Col>
          </Row>

          <Row>
            <Col md={8}>
              <p>{this.state.listing.description}</p>      
              <p><b>What's included</b>: {this.state.listing.included && this.state.listing.included.join(", ")}</p>
              <p><b>Gender</b>: {this.state.listing.gender}</p>
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
              <ReactMapGL mapStyle='mapbox://styles/mapbox/streets-v11' mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                {...this.state.viewport}
                onViewportChange={(viewport) => this.setState({viewport})}>
                  {this.state.listing.location && (
                    <Marker latitude={this.state.listing.location.coordinates[0]} longitude={this.state.listing.location.coordinates[1]} className="marker" />
                  )}
              </ReactMapGL>
              <p>{this.state.listing.location && 
                this.distance(this.state.listing.location.coordinates[0], this.state.listing.location.coordinates[1], 
                32.8801, -117.2340)} miles from campus
              </p>
            </Col>
          </Row>

          <Button variant="primary" onClick={this.handleShow} className="mb-1">
            Contact
          </Button>

          <Modal show={this.state.show} onHide={this.handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Contact Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.state.contact.instagram !== '' && 
                <a href={"https://www.instagram.com/" + this.state.contact.instagram} target="_blank" rel="noopener noreferrer">
                  <Figure.Image src={instagram} />
                </a>}
              {this.state.contact.facebook !== '' && 
                <a href={"m.me/username" + this.state.contact.facebook} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebookSquare} id="facebook" />
                </a>}
              {this.state.contact.twitter !== '' && 
                <a href={"https://www.twitter.com/" + this.state.contact.twitter} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTwitterSquare} id="twitter" />
                </a>}
              {this.state.contact.reddit !== '' && 
                <a href={"https://www.reddit.com/message/compose/?to=" + this.state.contact.reddit + "&subject=Interested%20in%20ThriftRents%20listing&message=Hi%2C%0A%0AI'm%20interested%20in%20your%20listing%20for%20" + this.state.listing.title + "."} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faRedditSquare} id="reddit" />
                </a>}
              {this.state.contact.snapchat !== '' && 
                <a href={"https://www.snapchat.com/add/" + this.state.contact.snapchat} target="_blank" rel="noopener noreferrer">
                  <Figure.Image src={snapchat} />
                </a>}
              {this.state.contact.wechat !== '' && 
                <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
                  <Figure.Image src={wechat}/>
                </OverlayTrigger>
              }
              {this.state.contact.phone !== '' && 
                <a href={"tel:" + this.state.contact.phone}>
                  <FontAwesomeIcon icon={faPhone} id="phone" />
                </a>}
              {this.state.contact.email !== '' && 
                <a href={"mailto:" + this.state.contact.email + "?subject=Interested%20in%20ThriftRents%20listing&body=Hi%2C%0A%0AI'm%20interested%20in%20your%20listing%20for%20" + this.state.listing.title + "."}>
                  <FontAwesomeIcon icon={faEnvelope} id="email" />
                </a>}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
      </Container>
    )
    )
  }
}

export default ViewListing;