import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import TranslateSubtitles from './translate/TranslateSubtitles';
import Login from './auth/Login'
import history from '../history';
import Home from './Home';
import SignUp from './auth/SignUp'

const App = () => {
  return (
    <div className="ui left aligned container">
      <Router history={history}>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/translate/subtitles" component={TranslateSubtitles}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/signup" component={SignUp}/>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
