import React, { useState, useEffect } from 'react'
import { Col, Row } from 'reactstrap'
import moment from 'moment'
import { ThemeProvider } from "styled-components";


import GlobalStyles from '../../globalStyles'
import { lightTheme, darkTheme } from "../../theme"
import ThemeToggler from '../../compenents/themeToggler'
import PlacesSearchInput from '../../compenents/placesSearchInput'
import NightSvg from '../../../public/assets/weather/night.svg'
import apiInstance from '../../api'

import './styles.css'

const HomePage = (props) => {

  const [currentWeatherData, setCurrentWeatherData] = useState({})
  const [currentUnit, setCurrentUnit] = useState('metric')
  const [theme, setTheme] = useState('dark')

  const getWeatherData = (latitude, longitude) => {
    apiInstance.get('/weather', {
      params: {
        lat: latitude,
        lon: longitude,
        appid: process.env.REACT_APP_API_KEY,
        units: 'metric'
      }
    }).then((data) => setCurrentWeatherData(data.data)).catch((error) => error)
  }

  const changeCurrentUnit = (unit) => {
    setCurrentUnit(unit)
  }

  const convertTemp = (temp) => {
    return Math.round(parseFloat(temp))
  }

  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      getWeatherData(latitude, longitude)
    })
  }, [])

  return <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
    <GlobalStyles />
    <div className='p-3'>
      <div className='d-flex justify-content-end'>
        <ThemeToggler theme={theme} toggleTheme={themeToggler} />
      </div>
      <div className='container justify-content-center'>
        <div className='mt-3'>
          <PlacesSearchInput />
        </div>
        <div className='box mt-3'>
          {/* <h3>{currentWeatherData.name}</h3>
      {
        currentWeatherData.dt && <h5>{moment(new Date(currentWeatherData.dt * 1000)).format('dddd, MMMM DD, YYYY | hh:mm A')}</h5>
      } */}
          <div>
            <Row className='justify-content-between'>
              <Col md={10}>
                <Row className='align-items-center'>
                  <img src={NightSvg} />
                  <div className='d-flex flex-row'>
                    <div className={`unitText px-2 ${currentUnit === 'metric' && 'active'}`} style={{ cursor: 'pointer' }} onClick={() => changeCurrentUnit('metric')}>C</div>
                    <div> | </div>
                    <div className={`unitText px-2 ${currentUnit === 'imperial' && 'active'}`} style={{ cursor: 'pointer' }} onClick={() => changeCurrentUnit('imperial')}>F</div>
                  </div>
                </Row>
              </Col>
              <Col>
                <div>Humidity: 68%</div>
                <div>Wind: 6 kmph</div>
                <div>Feels like: 2°</div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  </ThemeProvider>
}

export default HomePage