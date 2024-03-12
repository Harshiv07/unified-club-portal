import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import ProvideAuth from "./components/auth/ProvideAuth";
import PrivateRoute from "./components/auth/PrivateRoute";
import ClubGrid from "./pages/ClubGrid";
import ClubForm from "./pages/ClubForm";
import ClubData from "./pages/ClubData";
import EventForm from "./pages/EventForm";
import EventData from "./pages/EventData";
import UserEvents from "./pages/UserEvents";

function App() {
  return (
    <div className='App'>
      <ProvideAuth>
        <Router>
          <Switch>
            <Redirect exact from='/' to='/signin' />
            <Route path='/signup' exact component={SignUp}></Route>
            <Route path='/signin' exact component={SignIn}></Route>
            <PrivateRoute
              path='/clubs'
              exact
              component={() => {
                return (
                  <Dashboard
                    component={() => {
                      return <ClubGrid />;
                    }}
                  />
                );
              }}
            ></PrivateRoute>
            <PrivateRoute
              path='/club/form/:id'
              exact
              component={() => {
                return (
                  <Dashboard
                    component={() => {
                      return <ClubForm />;
                    }}
                  />
                );
              }}
            ></PrivateRoute>
            <PrivateRoute
              path='/club/:id'
              exact
              component={() => {
                return (
                  <Dashboard
                    component={() => {
                      return <ClubData />;
                    }}
                  />
                );
              }}
            ></PrivateRoute>
            <PrivateRoute
              path='/event/new/:clubId/:eventId'
              exact
              component={() => {
                return (
                  <Dashboard
                    component={() => {
                      return <EventForm />;
                    }}
                  />
                );
              }}
            ></PrivateRoute>
            <PrivateRoute
              path='/event/:id'
              exact
              component={() => {
                return (
                  <Dashboard
                    component={() => {
                      return <EventData />;
                    }}
                  />
                );
              }}
            ></PrivateRoute>
            <PrivateRoute
              path='/user/events'
              exact
              component={() => {
                return (
                  <Dashboard
                    component={() => {
                      return <UserEvents />;
                    }}
                  />
                );
              }}
            ></PrivateRoute>
          </Switch>
        </Router>
      </ProvideAuth>
    </div>
  );
}

export default App;
