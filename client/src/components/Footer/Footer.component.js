import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-regular-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css'

class Footer extends Component {

  render() {
      return (
        <footer>
            <div className="footer">
                <FontAwesomeIcon icon={faCopyright} id="cp" />
                2020 ThriftRents
            </div>
        </footer>
      )
  }
}

export default Footer;