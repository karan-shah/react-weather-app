import React from "react";
import { hot } from 'react-hot-loader';

import HomePage from './pages/homepage'

import './styles/custom.css'

function App() {

  return (
    <div>
      <HomePage />
    </div>
  );
}

export default hot(module)(App);
