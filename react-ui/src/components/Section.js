import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from 'react-bootstrap';

import Home from './routes/Home';
import About from './routes/About';
import Rooms from './routes/Rooms';
import LocalGuide from './routes/LocalGuide';

import EditButton from './buttons/EditButton';

const Section = (props) => {

  const defaultContent = <div className="text-center">
      <EditButton
        user={props.user}
        dataObj={{}}
        updateState={props.updateState}
        title={"Add"}
        length={2}
      />
    </div>;


  const content = ((props.section === "home") ?
    <Home data={props.data} user={props.user} message={props.message} updateState={props.updateState}/> :
    ((props.section === "about") ?
      <About data={props.data} user={props.user} message={props.message} updateState={props.updateState}/> :
      ((props.section === "rooms") ?
        <Rooms data={props.data} user={props.user} message={props.message} updateState={props.updateState}/> :
        ((props.section === "localGuide") ?
          <LocalGuide data={props.data} user={props.user} message={props.message} updateState={props.updateState}/> :
          <div>Error</div>))));

  return (
    <div>
      <div className="head">
        <PageHeader className="head-title">{`${props.section.charAt(0).toUpperCase()}${props.section.slice(1)}`}</PageHeader>
      </div>
      <div className="main-content">
        {(props.data.length < 1) ?
          defaultContent:
          content}
      </div>
    </div>
  );
};

export default Section;

Section.propsTypes = {
  section: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,

  updateState: PropTypes.func.isRequired
};
