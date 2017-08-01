import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';

import EditModal from '../components/modals/EditModal';
import EditButton from '../components/buttons/EditButton';


const Footer = (props) => {
  return (
    <footer className="text-center">
    <div className="foot" >
      <EditModal
        user={props.user}
        edit={props.edit}
        message={props.message}

        uploadFile={props.uploadFile}
        putData={props.putData}
        postData={props.postData}
        deleteData={props.deleteData}

        updateState={props.updateState}
      />

      <div className="foot-content">
        <Row className="clearfix">
          <i>Whether you have a question about our research
          or have any suggestions for us, we would love to hear from you!
          Click on the envelope below to leave us a message or find us
          through linkedin and facebook. Thank you!</i>
          <hr />
          <Col sm={6} className="text-center">
            <h3>Around the Web</h3>
            <h3>
              <a className="icon" href="#" onClick={(e) => {if(e) e.preventDefault(); window.open("https://www.linkedin.com/in/nancy-darr-968364b");}}>
                <i className="fa fa-linkedin-square" aria-hidden="true"></i>
              </a>
              <a className="icon" href="#" onClick={(e) => {if(e) e.preventDefault(); window.open("https://www.facebook.com/groups/PediatricBalanceScale/");}}>
                <i className="fa fa-facebook-square" aria-hidden="true"></i>
              </a>
            </h3>
          </Col>
          <Col sm={6} className="text-center">
            <h3>Get More Info</h3>
            <h3>
              <EditButton
                user={props.user}
                updateState={props.updateState}
                dataObj={{}}
                title="Send Message"
                length={2}
              />
            </h3>
          </Col>
          <hr />
        </Row>
      </div>
      </div>
    </footer>

  );
}


export default Footer;

Footer.propTypes = {
  user: PropTypes.object.isRequired,
  edit: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,

  uploadFile: PropTypes.func.isRequired,
  putData: PropTypes.func.isRequired,
  postData: PropTypes.func.isRequired,
  deleteData: PropTypes.func.isRequired,

  updateState: PropTypes.func.isRequired,
};
