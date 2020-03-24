import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import Select from 'react-select'
import './FilterBar.css'

const defaultTypes = ['Living Room', 'Shared Room', 'Private Room', 'Apartment', 'Condo', 'Townhouse'];
const defaultGenders = ['Male', 'Female', 'Any']

class FilterBar extends Component {
    constructor(props) {
      super(props);
  
      this.state = { 
        listings: [],
        type: defaultTypes,
        gender: defaultGenders,
        budget: ''
      }
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
    }

    changeType = selectedOptions => { 
        if (selectedOptions !== null) {
            this.setState({
                type: []
            }, () => {
                selectedOptions.forEach(option => { 
                    this.setState(prevState => ({
                        type: [...prevState.type, option.value]
                    }), () => {
                        this.updateListings()
                    })
                })
            })
        } else {
            this.setState({
                type: defaultTypes
            }, () => {
                this.updateListings()
            })
        }
    };

    changeGender = selectedOption => {
        if (selectedOption !== null) {
            this.setState({
                gender: [selectedOption.value]
            }, () => {
                this.updateListings()
            })
        } else {
            this.setState({
                type: defaultGenders
            }, () => {
                this.updateListings()
            })
        }
    };

    changeBudget = (e) => {
        this.setState({
          budget: e.target.value
            .replace(/[^0-9.]+/g, "")
        }, () => {
            console.log(this.state.budget)
            this.updateListings()
        })
      }

    updateListings = () => {
        let filteredType = [];      
        this.state.type.forEach(type => { 
            let filtered = this.state.listings.filter(el => el.type === type)
            filteredType = filteredType.concat(filtered)
        });
        let filteredGender = [];
        this.state.gender.forEach(gender => { 
            let filtered = filteredType.filter(el => el.gender === gender)
            filteredGender = filteredGender.concat(filtered)
        });
        let filteredPrice = filteredGender
        if (this.state.budget !== '') {
            filteredPrice = filteredGender.filter(el => el.price <= this.state.budget)
        }
        
        this.props.updateListings(filteredPrice)
    }
  
    render() {
        const typeOptions = defaultTypes.map(type => (
            {value: type, label: type}
        ))
        const genderOptions = defaultGenders.map(gender => (
            {value: gender, label: gender}
        ))

        return (
          <div className="filter-bar">
            <Select
                isMulti
                options={typeOptions}
                closeMenuOnSelect={false}
                isSearchable={false}
                isClearable={false}
                onChange={this.changeType}
                placeholder="Type"
                id="type-select"
            />
            <Select
                options={genderOptions}
                isSearchable={false}
                onChange={this.changeGender}
                placeholder="Gender"
                id="gender-select"
            />
            <div className="css-2b097c-container" id="budget-input" >
                <Form.Control type="text" value={this.state.budget} onChange={this.changeBudget} placeholder="Budget ($)" />
            </div> 
         </div>
        )
    }
  }
  
  export default FilterBar;