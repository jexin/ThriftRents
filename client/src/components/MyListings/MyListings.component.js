import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import moment from 'moment';
import { Container, CardDeck, Card, Col } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyListings.css';

class MyListings extends Component {
    constructor(props) {
        super(props);

        this.state = { listings: [] }
    }

    componentDidMount() {
        axios.get('http://localhost:5000/listings/')
            .then(res => {
                this.setState({
                    listings: res.data.filter(el => el.userId === this.props.user.googleId)
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    processBuffer(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    render() {
        return (
            <Container>
                <CardDeck>
                    {this.state.listings.map(listing => {
                        return (
                            <Col xs={12} sm={6} md={4} xl={3} key={listing._id} className="link mb-3">
                                <Card as={Link} to={'/details/' + listing._id} className="h-100">
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
                    })}
                </CardDeck>
            </Container>
        )
    }
}

export default MyListings;