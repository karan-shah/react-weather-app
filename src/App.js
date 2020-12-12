import React from "react";
import { hot } from 'react-hot-loader';

import HomePage from './pages/homepage'
import Footer from './compenents/footer'

import './styles/custom.css'

function App() {

  return (
    <div>
      <HomePage />
      <Footer />
    </div>
  );
}

export default hot(module)(App);
