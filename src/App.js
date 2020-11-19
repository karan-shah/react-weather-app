import React, { useEffect } from "react";
import { hot } from 'react-hot-loader';

import HomePage from './pages/homepage'

import './styles/custom.css'

function App() {

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => console.log({ position }))
  }, [])

  return (
    <div className="bg-dark">
      <HomePage />
    </div>
  );
}

export default hot(module)(App);
