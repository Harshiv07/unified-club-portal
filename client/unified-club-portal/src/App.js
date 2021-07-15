import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import  ProvideAuth  from './components/auth/ProvideAuth';
import PrivateRoute from './components/auth/PrivateRoute';
import ClubGrid from './pages/ClubGrid';
import ClubForm from './pages/ClubForm';
import ClubData from './pages/ClubData';

function App() {
  console.log('Main');
  return (
    
    <div className="App">
      <ProvideAuth>
      <Router>
          <Switch>
            <Route path='/signup' exact component={SignUp}></Route>
            <Route path='/signin' exact component={SignIn}></Route>
            <PrivateRoute path='/dashboard' exact component={Dashboard}></PrivateRoute>
            <PrivateRoute path='/clubs' exact component={ClubGrid}></PrivateRoute>
            <PrivateRoute path='/club/new' exact component={ClubForm}></PrivateRoute>
            <PrivateRoute path='/club/:id' exact component={ClubData}></PrivateRoute>
          </Switch>
        </Router>
      </ProvideAuth>

      
    </div>
  );
}

export default App;


/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */