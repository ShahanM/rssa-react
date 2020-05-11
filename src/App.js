import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  Navbar,
  NavbarBrand
} from 'reactstrap';
import Welcome from './content/welcome';
import Instructions from './content/Instructions';
import Preferences from './content/Preferences/prefPage';
import Movies from './content/MovieCards'; 
import MovieInfo from './content/movieInfo'; 
import Survey from "./content/survey";
import Exit from './content/ExitPage'; 
/*import 'bootstrap/dist/js/bootstrap.bundle.min';*/
import './App.css';

class App extends Component {

  render() { 
    return ( 
      <div>
      <div className="App">
      
      <nav className="navbar navbar-light bg-light">
  <span className="navbar-brand mb-0 h1">Movie Recommender Study</span>
</nav>
     
  </div>
<Router>
  <Switch>
          <Route exact path="/" component={Welcome} />
         <Route path="/inst" component={Instructions} />
          <Route path="/pref" component={Preferences} />
          <Route path="/movies" component={Movies} />
          <Route path="/movieInfo" component={MovieInfo} />
          <Route path="/survey" component={Survey} />
          <Route path="/exit" component={Exit} />
   </Switch>

</Router>
</div>
);
  }
}
 
export default App;
