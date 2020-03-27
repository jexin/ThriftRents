import React from 'react';
import { Link } from 'react-router-dom'
import { Container, CardDeck, Card, Col } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './MyListings.css';

class MyListings extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
          isLoading: true,
          listings: [] 
        }
    }

    componentDidMount() {
      axios.get('https://thriftrents.herokuapp.com/listings/')
        .then(res => {
          this.setState({
            isLoading: false,
            listings: res.data.filter(el => el.userId === this.props.user.googleId)
          })
        })
        .catch((err) => {
          console.log(err)
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
      return (
        this.state.isLoading ? (
          <div className="loading">
            <FontAwesomeIcon icon={faSpinner} id="spinner" spin />
          </div>
        ):(
          <Container>
            <CardDeck>
              {this.state.listings.map(listing => {
                return (
                  <Col xs={12} sm={6} md={4} xl={3} key={listing._id} className="mb-2">
                    <Card 
                      as={Link} 
                      to={`/details/${listing._id}`} 
                      className="card-link h-100"
                    >
                      <Card.Img 
                        variant="top" 
                        src={`data:image/png;base64,${this.processBuffer(listing.images[0].data)}`} 
                        alt="Listing Image"
                      />
                      <Card.Body>
                        <Card.Title>
                          ${listing.price}/month 
                          <span id="listing-type">{listing.type}</span>
                        </Card.Title>
                        <Card.Text>{listing.title}</Card.Text>
                      </Card.Body>
                      <Card.Footer>
                        <small className="text-muted">
                          Posted {moment(listing.createdAt).fromNow()}
                        </small>
                      </Card.Footer>
                    </Card>
                  </Col>
                )
              })}
            </CardDeck>
          </Container>
        )
      )
    }
}

export default MyListings;