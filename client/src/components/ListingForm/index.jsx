import React from 'react';
import { Link } from 'react-router-dom';
import {Container, Form, Col, Row, Button, InputGroup, FormControl, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { EditingState } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableEditColumn, TableInlineCellEditing } from '@devexpress/dx-react-grid-bootstrap4'
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';

import './ListingForm.css';

class ListingForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      title: '',
      address: '',
      images: [],
      description: '',
      price: '',
      type: '',
      bed: '',
      bath: '',
      gender: '',
      term: [],
      lengthAmount: '',
      lengthUnit: 'months',
      startDate: moment(),
      endDate: moment(),
      included: [],
      columns: [
        { name: 'room', title: 'Room' },
        { name: 'name', title: 'Name' },
        { name: 'tags', title: 'Tags' }
      ],
      rows: [],
      editingCells: [],
      contact: {
        instagram: '',
        facebook: '',
        twitter: '',
        reddit: '',
        snapchat: '',
        wechat: '',
        phone: '',
        email: ''
      }
    }

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeImages = this.onChangeImages.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeBed = this.onChangeBed.bind(this);
    this.onChangeBath = this.onChangeBath.bind(this);
    this.onChangeGender = this.onChangeGender.bind(this);
    this.onChangeTerm = this.onChangeTerm.bind(this);
    this.onChangeLengthAmount = this.onChangeLengthAmount.bind(this);
    this.onChangeLengthUnit = this.onChangeLengthUnit.bind(this);
    this.onChangeIncluded = this.onChangeIncluded.bind(this);
    this.onChangeInstagram = this.onChangeInstagram.bind(this);
    this.onChangeFacebook = this.onChangeFacebook.bind(this);
    this.onChangeTwitter = this.onChangeTwitter.bind(this);
    this.onChangeReddit = this.onChangeReddit.bind(this);
    this.onChangeSnapchat = this.onChangeSnapchat.bind(this);
    this.onChangeWeChat = this.onChangeWeChat.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.edit) {
      axios.get(`https://thriftrents.herokuapp.com/listings/${this.props.match.params.id}`)
        .then(res => {
          let images = [];
          for (var i = 0; i < res.data.images.length; i++) {
            images.push(new File([Buffer.from(res.data.images[i].data)], 'Image' + i,{ type: "image/png" }));
          }
          res.data.rows.map((row, i) => {
            row.id = i;
          })

          this.setState({
            isLoading: false,
            title: res.data.title,
            address: res.data.address,
            images: images,
            description: res.data.description,
            price: res.data.price,
            type: res.data.type,
            bed: res.data.bed,
            bath: res.data.bath,
            gender: res.data.gender,
            term: res.data.term,
            lengthAmount: res.data.length.replace(/\D/g, ""),
            lengthUnit: res.data.length.replace(/\d+\s*/g, ""),
            startDate: moment(res.data.start),
            endDate: moment(res.data.end),
            included: res.data.included,
            rows: res.data.rows,
            contact: res.data.contact
          })
        })
        .catch((err) => { 
          console.log(err) 
        })
    } else {
      this.setState({
        isLoading: false
      })
    }
  }

  onChangeTitle(e) {
    this.setState({ 
      title: e.target.value
    })
  }

  onChangeAddress(e) {
    this.setState({ 
      address: e.target.value,
      badAddress: false
    })
  }

  onChangeImages(e) {
    this.setState({ 
      images: e.target.files 
    })

    this.setState({
      tooMany: false,
      tooLarge: false,
      emptyImage: false
    })

    if (e.target.files.length > 5) {
      this.setState({ 
        tooMany: true 
      })
      e.target.value = null;
    } else {
      Array.from(e.target.files).forEach(file => {
        if (file.size > 1000 * 1000) {
          this.setState({ 
            tooLarge: true 
          })
          e.target.value = null;
        }
      })
    }
  }

  onChangeDescription(e) {
    this.setState({ 
      description: e.target.value 
    })
  }

  onChangePrice(e) {
    this.setState({
      price: e.target.value
        .replace(/[^0-9.]+/g, '')
        .replace(/(\.\d\d)\d+/g, '$1')
        .replace(/^\./g, '0.')
    })
  }

  onChangeType(e) {
    this.setState({ 
      type: e.target.value 
    })
  }

  onChangeBed(e) {
    this.setState({
      bed: e.target.value
        .replace(/[^0-9.]+/g, '')
    })
  }

  onChangeBath(e) {
    this.setState({
      bath: e.target.value
        .replace(/[^0-9.]+/g, "")
    })
  }

  onChangeGender(e) {
    this.setState({ 
      gender: e.target.value 
    })
  }

  onChangeTerm(e) {
    let term = this.state.term;

    if (e.target.checked) {
      term.push(e.target.value);
    } else {
      let index = term.indexOf(e.target.value);
      term.splice(index, 1);
    }

    this.setState({ 
      term: term 
    })
  }

  onChangeLengthAmount(e) {
    this.setState({
      lengthAmount: e.target.value
        .replace(/[^0-9.]+/g, "")
    })
  }

  onChangeLengthUnit(e) {
    this.setState({ 
      lengthUnit: e.target.value
    })
  }

  onChangeIncluded(e) {
    let included = this.state.included;

    if (e.target.checked) {
      included.push(e.target.value);
    } else {
      let index = included.indexOf(e.target.value);
      included.splice(index, 1);
    }
    this.setState({ 
      included: included 
    })
  }

  setEditingCells = (value) => {
    this.setState({ 
      editingCells: value 
    })
  };

  commitChanges = ({ added, changed, deleted }) => {
    let changedRows;

    if (added) {
      const startingAddedId = this.state.rows.length > 0
        ? Math.max(this.state.rows[this.state.rows.length - 1].id, this.state.rows[0].id) + 1
        : 0;
      changedRows = [
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
        ...this.state.rows,
      ];

      this.setEditingCells([{ rowId: startingAddedId, columnName: this.state.columns[0].name }]);
    }

    if (changed) {
      changedRows = this.state.rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
    }
    
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = this.state.rows.filter(row => !deletedSet.has(row.id));
    }

    this.setState({ 
      rows: changedRows
    })
  };

  addEmptyRow = () => this.commitChanges({ added: [{}] });

  onChangeInstagram(e) {
    let contact = this.state.contact;
    contact.instagram = e.target.value;
    this.setState({
      contact: contact, 
      noContact: false
    })
  }

  onChangeFacebook(e) {
    let contact = this.state.contact;
    contact.facebook = e.target.value;
    this.setState({
      contact: contact, 
      noContact: false
    })
  }

  onChangeTwitter(e) {
    let contact = this.state.contact;
    contact.twitter = e.target.value;
    this.setState({
      contact: contact, 
      noContact: false
    })
  }

  onChangeReddit(e) {
    let contact = this.state.contact;
    contact.reddit = e.target.value;
    this.setState({
      contact: contact, 
      noContact: false
    })
  }

  onChangeSnapchat(e) {
    let contact = this.state.contact;
    contact.snapchat = e.target.value;
    this.setState({
      contact: contact, 
      noContact: false
    })
  }

  onChangeWeChat(e) {
    let contact = this.state.contact;
    contact.wechat = e.target.value;
    this.setState({
      contact: contact, 
      noContact: false
    })
  }

  onChangePhone(e) {
    let contact = this.state.contact;
    contact.phone = e.target.value.replace(/[^0-9.]+/g, "")
    this.setState({
      contact: contact, 
      noContact: false
    })
  }

  onChangeEmail(e) {
    let contact = this.state.contact;
    contact.email = e.target.value;
    this.setState({
      contact: contact, 
      noContact: false
    })
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.state.images.length < 1) {
      this.setState({ 
        emptyImage: true 
      })
    } else if (
      this.state.contact.instagram === '' && 
      this.state.contact.facebook === '' && 
      this.state.contact.twitter === '' && 
      this.state.contact.reddit === '' && 
      this.state.contact.snapchat === '' && 
      this.state.contact.wechat === '' && 
      this.state.contact.phone === '' &&
      this.state.contact.email === '') {
        this.setState({ 
          noContact: true 
        })
    } else {
      axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.address}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}&limit=1`)
        .then(res => this.submitListing(res.data.features[0].center))
        .catch(error => {
          this.setState({ 
            badAddress: true 
          })
      })
    }
  }

  submitListing(coords) {
    const data = new FormData();
    
    const listing = {
      title: this.state.title,
      address: this.state.address,
      lat: coords[1],
      long: coords[0],
      description: this.state.description,
      price: this.state.price,
      type: this.state.type,
      bed: this.state.bed,
      bath: this.state.bath,
      gender: this.state.gender,
      term: this.state.term,
      length: `${this.state.lengthAmount} ${this.state.lengthUnit}`,
      start: this.state.startDate,
      end: this.state.endDate,
      included: this.state.included,
      rows: this.state.rows,
      contact: this.state.contact,
      userId: this.props.user.googleId || ' '
    }

    Array.from(this.state.images).forEach(image => {
      data.append('file', image);
    })
    data.append('listing', JSON.stringify(listing));

    if (!this.props.edit) {
      axios.post('https://thriftrents.herokuapp.com/listings/add', data)
      .then(res => {
        console.log(res.data);
        window.location.href = '/';
      })
      .catch((err) => console.log(err))
    } else {
      axios.post(`https://thriftrents.herokuapp.com/listings/update/${this.props.match.params.id}`, data)
      .then(res => {
          console.log(res.data);
          window.location.href = `/details/${this.props.match.params.id}`;
      })
      .catch((err) => console.log(err))
    }
  }

  render() {
    const tableColumnExtensions = [
      { columnName: 'room', width: '120' },
      { columnName: 'name', width: '180' },
      { columnName: 'tags', width: '360' }
    ]
    const getRowId = row => row.id;
    const FocusableCell = ({ onClick, ...restProps }) => (
      <Table.Cell {...restProps} tabIndex={0} onFocus={onClick} />
    );      
    const CommandButton = ({
      onExecute, icon, text, hint, color,
    }) => (
      <button
        type="button"
        className="btn btn-link"
        style={{ padding: 11 }}
        onClick={(e) => {
          onExecute();
          e.stopPropagation();
        }}
        title={hint}
      >
        <span className={color || 'undefined'}>
          {icon ? <i className={`oi oi-${icon}`} style={{ marginRight: text ? 5 : 0 }} /> : null}
          {text}
        </span>
      </button>
    );
    const AddButton = ({ onExecute }) => (
      <CommandButton icon="plus" hint="Create new row" onExecute={onExecute} />
    );
    const DeleteButton = ({ onExecute }) => (
      <CommandButton
        icon="trash"
        hint="Delete row"
        color="text-danger"
        onExecute={onExecute}
      />
    );
    const commandComponents = {
      add: AddButton,
      delete: DeleteButton
    };
    const Command = ({ id, onExecute }) => {
      const ButtonComponent = commandComponents[id];
      return (
        <ButtonComponent
          onExecute={onExecute}
        />
      );
    };

    return (
      this.state.isLoading ? (
        <div className="loading">
          <FontAwesomeIcon icon={faSpinner} id="spinner" spin />
        </div>
      ):(
        <Container>
          <Form onSubmit={this.onSubmit} encType="multipart/form-data" className="mt-2">
            <Form.Group as={Row} controlId="formHorizontalTitle">
              <Form.Label column sm={2}>Title</Form.Label>
              <Col sm={10}>
                <Form.Control 
                  value={this.state.title} 
                  onChange={this.onChangeTitle} 
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalAddress">
              <Form.Label column sm={2}>Address</Form.Label>
              <Col sm={10}>
                <Form.Control 
                  value={this.state.address} 
                  onChange={this.onChangeAddress} 
                  required
                />
                {this.state.badAddress && (
                  <Alert variant="danger">
                    Please enter a valid address.
                  </Alert>
                )}
                <Form.Text className="text-muted">
                  We only use the address to map your listing. It will not be shared publicly.
                </Form.Text>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalImages">
              <Form.Label column >Images (up to 5)</Form.Label>
              <Col sm={10}>
                <input 
                  type="file"
                  accept="image/png, image/jpeg" 
                  onChange={this.onChangeImages} 
                  multiple 
                  className="d-none" 
                  id="files"
                />
                <Button 
                  as="label" 
                  htmlFor="files" 
                  variant="info" 
                  id="fileInput"
                >
                  {!this.props.edit ? 'Upload files ' : 'Reupload files '}
                  <Badge variant="light">{this.state.images.length}</Badge>
                </Button>
                {(this.state.emptyImage || this.state.tooMany) && (
                  <Alert variant="danger">
                    Please select up to 5 files.
                  </Alert>
                )}
                {this.state.tooLarge && (
                  <Alert variant="danger">
                    Please select files less than 1MB.
                  </Alert>
                )}
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalDescription">
              <Form.Label column sm={2}>Description</Form.Label>
              <Col sm={10}>
                <Form.Control 
                  as="textarea" 
                  placeholder="Optional" 
                  value={this.state.description} 
                  onChange={this.onChangeDescription}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formGridPrice">
              <Form.Label column sm={2}>Price</Form.Label>
              <Col sm={10}>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl 
                    placeholder="0.00" 
                    value={this.state.price} 
                    onChange={this.onChangePrice} 
                    required
                  />
                  <InputGroup.Append>
                    <InputGroup.Text>per month</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label as="legend" column sm={2}>
                Listing Type
              </Form.Label>
              <Col sm={10}>
                <Form.Check
                  required
                  type="radio"
                  label="Living Room"
                  name="formHorizontalRadios"
                  value="Living Room"
                  checked={this.state.type === "Living Room"} 
                  onChange={this.onChangeType}
                />
                <Form.Check
                  type="radio"
                  label="Private Room"
                  name="formHorizontalRadios"
                  value="Private Room"
                  checked={this.state.type === "Private Room"} 
                  onChange={this.onChangeType}
                />
                <Form.Check
                  type="radio"
                  label="Shared Room"
                  name="formHorizontalRadios"
                  value="Shared Room"
                  checked={this.state.type === "Shared Room"} 
                  onChange={this.onChangeType}
                />
                <Form.Check
                  type="radio"
                  label="Apartment"
                  name="formHorizontalRadios"
                  value="Apartment"
                  checked={this.state.type === "Apartment"} 
                  onChange={this.onChangeType}
                />
                <Form.Check
                  type="radio"
                  label="Condo"
                  name="formHorizontalRadios"
                  value="Condo"
                  checked={this.state.type === "Condo"} 
                  onChange={this.onChangeType}
                />
                <Form.Check
                  type="radio"
                  label="Townhouse"
                  name="formHorizontalRadios"
                  value="Townhouse"
                  checked={this.state.type === "Townhouse"} 
                  onChange={this.onChangeType}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalBed">
              <Form.Label column sm={2}>Bedrooms</Form.Label>
              <Col sm={10}>
                <Form.Control 
                  value={this.state.bed} 
                  onChange={this.onChangeBed} 
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalBath">
              <Form.Label column sm={2}>Bathrooms</Form.Label>
              <Col sm={10}>
                <Form.Control 
                  value={this.state.bath} 
                  onChange={this.onChangeBath} 
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label as="legend" column sm={2}>Gender</Form.Label>
              <Col sm={10}>
                <Form.Check
                  required
                  type="radio"
                  label="Male"
                  name="GenderRadios"
                  value="Male"
                  checked={this.state.gender === "Male"} 
                  onChange={this.onChangeGender}
                />
                <Form.Check
                  type="radio"
                  label="Female"
                  name="GenderRadios"
                  value="Female"
                  checked={this.state.gender === "Female"} 
                  onChange={this.onChangeGender}
                />
                <Form.Check
                  type="radio"
                  label="Any"
                  name="GenderRadios"
                  value="Any"
                  checked={this.state.gender === "Any"} 
                  onChange={this.onChangeGender}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label as="legend" column sm={2}>Lease Terms</Form.Label>
              <Col sm={10}>
                <Form.Check
                  inline
                  type="checkbox"
                  label="Fall Quarter"
                  name="TermCheckboxes"
                  value="Fall Quarter"
                  checked={this.state.term.includes("Fall Quarter")} 
                  onChange={this.onChangeTerm}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Winter Quarter"
                  name="TermCheckboxes"
                  value="Winter Quarter"
                  checked={this.state.term.includes("Winter Quarter")} 
                  onChange={this.onChangeTerm}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Spring Quarter"
                  name="TermCheckboxes"
                  value="Spring Quarter"
                  checked={this.state.term.includes("Spring Quarter")} 
                  onChange={this.onChangeTerm}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Summer Session"
                  name="TermCheckboxes"
                  value="Summer Session"
                  checked={this.state.term.includes("Summer Session")} 
                  onChange={this.onChangeTerm}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Full year"
                  name="TermCheckboxes"
                  value="Full Year"
                  checked={this.state.term.includes("Full Year")} 
                  onChange={this.onChangeTerm}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formGridLength">
              <Form.Label as="legend" column sm={2}>Lease Length</Form.Label>
              <Col sm={10}>
                <InputGroup>
                  <FormControl 
                    placeholder="Amount" 
                    value={this.state.lengthAmount} 
                    onChange={this.onChangeLengthAmount} 
                    required
                  />
                  <InputGroup.Append>
                    <Form.Group controlId="formGridUnit">
                        <Form.Control 
                          as="select" 
                          value={this.state.lengthUnit} 
                          onChange={this.onChangeLengthUnit} 
                          required
                        >
                          <option value="months">months</option>
                          <option value="weeks">weeks</option>
                          <option value="days">days</option>
                        </Form.Control>
                    </Form.Group>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalBath">
              <Form.Label column sm={2}>Start-End Date</Form.Label>
              <Col sm={10}>
                <DateRangePicker
                  required
                  startDate={this.state.startDate} 
                  startDateId="startDateId" 
                  endDate={this.state.endDate}
                  endDateId="endDateId"
                  onDatesChange={({ startDate, endDate }) => { this.setState({ startDate, endDate })}}
                  focusedInput={this.state.focusedInput} 
                  onFocusChange={focusedInput => this.setState({ focusedInput })} 
                  readOnly
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label as="legend" column sm={2}>What's Included</Form.Label>
              <Col sm={10}>
                <Form.Check
                  inline
                  type="checkbox"
                  label="All utilities"
                  name="formHorizontalCheckboxes"
                  value="All utilities"
                  checked={this.state.included.includes("All utilities")} 
                  onChange={this.onChangeIncluded}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Partial utilities"
                  name="formHorizontalCheckboxes"
                  value="Partial utilities"
                  checked={this.state.included.includes("Partial utilities")} 
                  onChange={this.onChangeIncluded}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Furnished"
                  name="formHorizontalCheckboxes"
                  value="Furnished"
                  checked={this.state.included.includes("Furnished")} 
                  onChange={this.onChangeIncluded}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="In-unit laundry"
                  name="formHorizontalCheckboxes"
                  value="In-unit laundry"
                  checked={this.state.included.includes("In-unit laundry")} 
                  onChange={this.onChangeIncluded}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Pets"
                  name="formHorizontalCheckboxes"
                  value="Pets"
                  checked={this.state.included.includes("Pets")} 
                  onChange={this.onChangeIncluded}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Parking"
                  name="formHorizontalCheckboxes"
                  value="Parking"
                  checked={this.state.included.includes("Parking")} 
                  onChange={this.onChangeIncluded}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Gym"
                  name="formHorizontalCheckboxes"
                  value="Gym"
                  checked={this.state.included.includes("Gym")} 
                  onChange={this.onChangeIncluded}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalMates">
              <Form.Label column sm={2}>Housemates/{"\n"}Roommates</Form.Label>
              <Col sm={10}>
                <Grid
                  rows={this.state.rows}
                  columns={this.state.columns}
                  getRowId={getRowId}
                >
                  <EditingState
                    onCommitChanges={this.commitChanges}
                    editingCells={this.state.editingCells}
                    onEditingCellsChange={this.setEditingCells}
                    addedRows={[]}
                    onAddedRowsChange={this.addEmptyRow}
                  />
                  <Table 
                    cellComponent={FocusableCell} 
                    columnExtensions={tableColumnExtensions} 
                  />
                  <TableHeaderRow />
                  <TableInlineCellEditing selectTextOnEditStart />
                  <TableEditColumn
                    showAddCommand
                    showDeleteCommand
                    commandComponent={Command}
                  />
                </Grid>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formGridContact">
              <Form.Label column sm={2}>Contact</Form.Label>
              <Col sm={10}>
                <Form.Group as={Row} controlId="formGridInstagram">
                  <Form.Label column sm={2}>Instagram:</Form.Label>
                  <Col sm={10}>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>@</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl 
                        value={this.state.contact.instagram} 
                        onChange={this.onChangeInstagram} 
                      />
                    </InputGroup>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formGridFacebook">
                  <Form.Label column sm={2}>Facebook:</Form.Label>
                  <Col sm={10}>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>@</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl 
                        value={this.state.contact.facebook} 
                        onChange={this.onChangeFacebook} 
                      />
                    </InputGroup>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formGridTwitter">
                  <Form.Label column sm={2}>Twitter:</Form.Label>
                  <Col sm={10}>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>@</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl 
                        value={this.state.contact.twitter} 
                        onChange={this.onChangeTwitter} 
                      />
                    </InputGroup>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formGridReddit">
                  <Form.Label column sm={2}>Reddit:</Form.Label>
                  <Col sm={10}>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>@</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl 
                        value={this.state.contact.reddit} 
                        onChange={this.onChangeReddit} 
                      />
                    </InputGroup>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formGridSnapchat">
                  <Form.Label column sm={2}>Snapchat:</Form.Label>
                  <Col sm={10}>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>@</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl 
                        value={this.state.contact.snapchat} 
                        onChange={this.onChangeSnapchat} 
                      />
                    </InputGroup>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formGridWeChat">
                  <Form.Label column sm={2}>WeChat:</Form.Label>
                  <Col sm={10}>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>@</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl 
                        value={this.state.contact.wechat} 
                        onChange={this.onChangeWeChat} 
                      />
                    </InputGroup>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formGridPhone">
                  <Form.Label column sm={2}>Phone:</Form.Label>
                  <Col sm={10}>
                    <InputGroup>
                      <FormControl 
                        type="tel" 
                        value={this.state.contact.phone} 
                        onChange={this.onChangePhone} 
                      />
                    </InputGroup>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formGridEmail">
                  <Form.Label column sm={2}>Email:</Form.Label>
                  <Col sm={10}>
                    <InputGroup>
                      <FormControl 
                        type="email" 
                        value={this.state.contact.email} 
                        onChange={this.onChangeEmail}
                      />
                    </InputGroup>
                  </Col>
                </Form.Group>
                {this.state.noContact && (
                  <Alert variant="danger">
                    Please provide a method of contact.
                  </Alert>
                )}
              </Col>
            </Form.Group>

            {!this.props.edit ? (
              <Button variant="primary" type="submit" className="mb-2">Submit</Button>
            ) : (
              <>
              <Button variant="primary" type="submit" className="mr-2 mb-2 ml-auto">Save Changes</Button>
              <Button variant="light" as={Link} to={`/details/${this.props.match.params.id}`} className="mb-2">Cancel</Button>
              </>
            )}
          </Form>
        </Container> 
      )
    )
  }
}

export default ListingForm;