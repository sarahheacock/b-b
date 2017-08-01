import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

import { errorStatus } from '../../data/data';

const AlertMessage = (props) => {
  const style = (props.message === errorStatus.messageSuccess) ? "info" : "warning";

  return (
    <div className="text-center">
      {
        (props.message === '') ?
          <div></div> :
          <Alert bsStyle={style} className="content text-center alertMessage">{props.message}</Alert>
      }
    </div>
  );
}


export default AlertMessage;

AlertMessage.propTypes = {
  message: PropTypes.string.isRequired
};
