import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, FormControl } from 'react-bootstrap';
import { Image } from 'cloudinary-react';

import { messageData, loginData, formData, cloudName } from '../../data/data';
const formInfo = {...messageData, ...loginData, ...formData};



const FormImage = (props) => {

  console.log('cloudName', cloudName);

  return (
    <div>
     {(!(!formInfo[props.group])) ?
         <FormControl
           name={props.name}
           type={formInfo[props.group]["type"]}
           placeholder={formInfo[props.group]["placeholder"]}
           componentClass={formInfo[props.group]["componentClass"]}
           value={props.value}
           onChange={props.formChange}
         />:
         ((props.group === "carousel" || props.group === "image") ?
            <Row className="clearfix">
              <Row className="clearfix">
                <Col sm={6} className="text-center">
                  {(!props.value.includes("http")) ?
                    <Image cloudName={cloudName} publicId={props.value} width="200" crop="scale"/>:
                    <img className="sampleImg" src={props.value} alt={props.value}/>
                  }
                </Col>
                <Col sm={2} className="text-center">
                  {(props.group === "carousel") ?
                  <Button bsStyle="link" name={props.name} value="delete" onClick={props.formChange}>
                    Delete
                  </Button>:
                  <div></div>}
                </Col>
              </Row>
              <hr />
            </Row> :
            <div></div>)
      }
    </div>
  );
}

export default FormImage;

FormImage.propTypes = {
  formChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
