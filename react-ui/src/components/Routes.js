import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Section from './Section';
import Book from './routes/Book';
import Login from './routes/Login';
import Welcome from './routes/Welcome';
import WelcomeAdmin from './routes/WelcomeAdmin';
import NotFound from './routes/NotFound';


const Routes = (props) => {
  const routes = (Object.keys(props.data)).map((k) => {
    if(k === "home"){
      return (
        <Route key={`route${k}`} exact path="/" render={ () => (
          <Section
            section={k}
            data={props.data[k]}
            user={props.user}
            message={props.message}

            updateState={props.updateState}
          />) }
        />);
    }
    else {
      return (
        <Route key={`route${k}`} path={`/${k}`} render={ () => (
          <Section
            section={k}
            data={props.data[k]}
            user={props.user}
            message={props.message}

            updateState={props.updateState}
          />) }
        />);
    }
  });


  return (
    <Switch>
      {routes}

      <Route path="/welcome" render={ () => ((props.user.username) ?
        ((props.user.admin) ?
          <WelcomeAdmin
            data={props.data}
            user={props.user}

            getData={props.getData}
            updateState={props.updateState}
          /> :
          <Welcome
            data={props.data}
            user={props.user}

            getData={props.getData}
            updateState={props.updateState}
          />) :
        <Redirect to="/login" />
      )}
      />

      <Route path="/login" render={ () => ((props.user.username) ?
        <Redirect to="/welcome" /> :
          <Login
            data={props.data}
            user={props.user}
            message={props.message}
            roomID={props.checkout.selected.roomID}

            getData={props.getData}
            postData={props.postData}
            updateState={props.updateState}
          />

        ) }
      />

      <Route path="/book-now" render={ () => (
        <Book
          data={props.data}
          user={props.user}
          checkout={props.checkout}
          checkEdit={props.checkEdit}

          getData={props.getData}
          fetchSearch={props.fetchSearch}
          chargeClient={props.chargeClient}

          updateState={props.updateState}
        />) }
      />

      <Route render={ () => (
        <NotFound />
      )} />

    </Switch>
  );
};

export default Routes;

Routes.propsTypes = {
  page: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  checkEdit: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  checkout: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  refundClient: PropTypes.func.isRequired,
  chargeClient: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  putData: PropTypes.func.isRequired,
  postData: PropTypes.func.isRequired,
  deleteData: PropTypes.func.isRequired,
  fetchSearch: PropTypes.func.isRequired
};
