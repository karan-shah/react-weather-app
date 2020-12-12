import React, { useState, useEffect } from 'react'
import { Col, Row } from 'reactstrap'
import moment from 'moment'
import { ThemeProvider } from "styled-components";
import axios from 'axios'

import GlobalStyles from '../../globalStyles'
import { lightTheme, darkTheme } from "../../theme"
import ThemeToggler from '../../compenents/themeToggler'
import PlacesSearchInput from '../../compenents/placesSearchInput'
import NightSvg from '../../../public/assets/weather/night.svg'
import { fetchWeatherDataByCity } from '../../utils/FetchWeatherData'

import './styles.css'

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BIGDATA_CLOUD_URL,
  timeout: 10000,
})

const HomePage = (props) => {

  const [currentWeatherData, setCurrentWeatherData] = useState({})
  const [currentCity, setCurrentCity] = useState('')
  const [currentUnit, setCurrentUnit] = useState('metric')
  const [theme, setTheme] = useState('dark')

  const getCurrentCityNameByLatLng = async (lat, lng) => {
    try {
      const res = await apiInstance.get(`reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
      if (res.data.city) {
        setCurrentCity(res.data)
        getWeatherDataByCity(res.data.city, currentUnit)
      }
    } catch (e) {
      return e
    }
  }

  const getWeatherDataByCity = async (city, unit = currentUnit) => {
    const res = await fetchWeatherDataByCity(city, unit)
    if (res.name) {
      setCurrentWeatherData(res)
    }
  }

  const changeCurrentUnit = (unit) => {
    setCurrentUnit(unit)
    getWeatherDataByCity(currentCity.city, unit)
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
      getCurrentCityNameByLatLng(latitude, longitude)
    })
  }, [])

  return <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
    <GlobalStyles />
    <div className='app-container p-3'>
      <div className='d-flex justify-content-end'>
        <ThemeToggler theme={theme} toggleTheme={themeToggler} />
      </div>
      <div className='container justify-content-center'>
        <div className='mt-3'>
          <PlacesSearchInput theme={theme} getWeatherDataByCity={getWeatherDataByCity} setCurrentCity={setCurrentCity} />
        </div>
        <div className='box mt-3'>
          <h3>{currentCity.city ? `${currentCity.city}, ${currentCity.principalSubdivision}, ${currentCity.countryName}` : currentCity.address}</h3>
          {
            currentWeatherData.dt && <h5>{moment.unix(currentWeatherData.dt).utc().add(currentWeatherData.timezone, 's').format('dddd, MMMM DD, YYYY | hh:mm A')}</h5>
          }
          <div>
            {
              currentWeatherData.name ? <Row className='justify-content-between'>
                <Col md={10}>
                  <Row className=''>
                    <img src={NightSvg} />
                    <div className='d-flex flex-row mt-3'>
                      <h3>
                        {convertTemp(currentWeatherData.main.temp) + '°'}
                      </h3>
                      <div className='d-flex flex-row'>
                        <div className={`unitText px-2 ${currentUnit === 'metric' && 'active'}`} style={{ cursor: 'pointer' }} onClick={() => changeCurrentUnit('metric')}>C</div>
                        <div> | </div>
                        <div className={`unitText px-2 ${currentUnit === 'imperial' && 'active'}`} style={{ cursor: 'pointer' }} onClick={() => changeCurrentUnit('imperial')}>F</div>
                      </div>
                    </div>
                  </Row>
                </Col>
                <Col>
                  <div>Humidity: {currentWeatherData.main.humidity}%</div>
                  <div>Wind: {currentWeatherData.wind.speed} {currentUnit === 'metric' ? 'mps' : 'mph'}</div>
                  <div>Feels like: {convertTemp(currentWeatherData.main.feels_like)}°</div>
                </Col>
              </Row> : null
            }
          </div>
        </div>
      </div>
    </div>
  </ThemeProvider>
}

export default HomePage