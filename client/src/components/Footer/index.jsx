import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';
import './Footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer">
        <FontAwesomeIcon icon={faCopyright} id="cp" />
        2021 ThriftRents
      </div>
    </footer>
  )
}

export default Footer;