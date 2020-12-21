import React, { useState, useEffect } from 'react'
import { Col, Row } from 'reactstrap'
import { ThemeProvider } from "styled-components";
import axios from 'axios'

import GlobalStyles from '../../globalStyles'
import { lightTheme, darkTheme } from "../../theme"
import ThemeToggler from '../../compenents/themeToggler'
import PlacesSearchInput from '../../compenents/placesSearchInput'
import { fetchWeatherDataUsingOneCall } from '../../utils/FetchWeatherData'
import ConvertTime from '../../utils/ConvertTime'
import getWeatherBackground from '../../utils/WeatherBackground'
import getWeatherIcon from '../../utils/WeatherIcon'
import DayOrNight from '../../utils/DayOrNight'

import './styles.css'

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_OPENCAGE_URL,
  timeout: 10000,
  params: {
    key: process.env.REACT_APP_OPENCAGE_KEY
  }
})

const HomePage = (props) => {

  const [isLocationEnabled, setLocationPermissionValue] = useState()
  const [currentCityLatLng, setCurrentCityLatLng] = useState({})
  const [currentCity, setCurrentCity] = useState('')
  const [currentWeatherData, setCurrentWeatherData] = useState({})
  const [currentCityTimezoneOffset, setCurrentCityTimezoneOffset] = useState()
  const [currentCityHourlyWeatherData, setCurrentCityHourlyWeatherData] = useState([])
  const [currentCityDailyWeatherData, setCurrentCityDailyWeatherData] = useState([])
  const [currentUnit, setCurrentUnit] = useState('metric')
  const [theme, setTheme] = useState('')

  const getCurrentCityNameByLatLng = async (lat, lng) => {
    try {
      const res = await apiInstance.get(`json?q=${lat} ${lng}`)
      if (res.status === 200) {
        setCurrentCity(res.data.results[0].formatted)
        getWeeklyWeatherData(lat, lng, currentUnit)
      }
    } catch (e) {
      return e
    }
  }
  const getCurrentCityLatLngByName = async (name) => {
    try {
      const res = await apiInstance.get(`json?q=${name}`)
      if (res.status === 200) {
        const data = res.data.results[0]
        setCurrentCityLatLng(data.geometry)
        setCurrentCity(data.formatted)
        getWeeklyWeatherData(data.geometry.lat, data.geometry.lng)
      }
    } catch (e) {
      return e
    }
  }

  const setCurrentThemeByWeatherData = (currentWeatherData, timezoneOffset) => {
    const { sunrise, sunset, dt } = currentWeatherData
    const sunriseTime = ConvertTime(sunrise, timezoneOffset)
    const sunsetTime = ConvertTime(sunset, timezoneOffset)
    const currentTime = ConvertTime(dt, timezoneOffset)
    const dayOrNight = DayOrNight(sunriseTime, sunsetTime, currentTime)
    setTheme(dayOrNight === 'day' ? 'light' : 'dark')
  }

  const getWeeklyWeatherData = async (lat, lng, unit = currentUnit) => {
    const res = await fetchWeatherDataUsingOneCall(lat, lng, unit)
    if (res.lat) {
      setCurrentThemeByWeatherData(res.current, res.timezone_offset)
      setCurrentWeatherData(res.current)
      setCurrentCityTimezoneOffset(res.timezone_offset)
      setCurrentCityHourlyWeatherData(res.hourly)
      setCurrentCityDailyWeatherData(res.daily)
    }
  }

  const changeCurrentUnit = (unit) => {
    setCurrentUnit(unit)
    getWeeklyWeatherData(currentCityLatLng.lat, currentCityLatLng.lng, unit)
  }

  const convertTemp = (temp) => {
    return Math.round(parseFloat(temp))
  }

  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
  }

  const changeCurrentCity = (newCity) => {
    getCurrentCityLatLngByName(newCity)
  }

  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' })
      .then(res => {
        setLocationPermissionValue(res.state === 'denied' ? false : true)
        if (res.state !== 'denied') {
          navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setCurrentCityLatLng({ lat: latitude, lng: longitude })
            getCurrentCityNameByLatLng(latitude, longitude)
          }, (error) => {
            if (error.code === 1) {
              setLocationPermissionValue(false)
            }
          })
        }
      })
  }, [])

  if (isLocationEnabled) {
    return <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles />
      <div className='app-container p-3'>
        <div className='d-flex justify-content-end'>
          <ThemeToggler theme={theme} toggleTheme={themeToggler} />
        </div>
        <div className='container justify-content-center'>
          <div className='mt-3'>
            <PlacesSearchInput theme={theme} changeCurrentCity={changeCurrentCity} />
          </div>
          {
            currentWeatherData.temp ? <div className='box p-0 mt-3 text-white weather-data-container'
              style={{ backgroundImage: `url(/assets/weather-backgrounds/${getWeatherBackground(currentWeatherData, currentCityTimezoneOffset)}.jpg)` }}
            >
              <div className='p-3'>
                <h3>{currentCity}</h3>
                {
                  currentWeatherData.dt && <h5 className='text-light'>{ConvertTime(currentWeatherData.dt, currentCityTimezoneOffset).format('dddd, MMMM DD, YYYY | hh:mm A')}</h5>
                }
              </div>
              <div>
                {
                  currentWeatherData.temp ? <Row className='m-0 justify-content-between'>
                    <Col md={9}>
                      <Row className='m-0'>
                        <div className='text-center'>
                          <img src={`/assets/weather/${getWeatherIcon(currentWeatherData, currentWeatherData.sunrise, currentWeatherData.sunset, currentCityTimezoneOffset)}.svg`} className='current-weather-svg' />
                          <h5 className='text-capitalize'>{currentWeatherData.weather[0].description}</h5>
                        </div>
                        <div className='d-flex flex-row mt-3'>
                          <div className='current-weather-text'>{convertTemp(currentWeatherData.temp)}</div>
                          <div className='d-flex flex-row mt-3'>
                            <div className='temp-degree'>°</div>
                            <div className={`unitText px-2 ${currentUnit === 'metric' ? 'active' : 'text-light font-weight-100'}`} onClick={() => changeCurrentUnit('metric')}>C</div>
                            <div className='text-light'> | </div>
                            <div className={`unitText px-2 ${currentUnit === 'imperial' ? 'active' : 'text-light font-weight-100'}`} onClick={() => changeCurrentUnit('imperial')}>F</div>
                          </div>
                        </div>
                      </Row>
                    </Col>
                    <Col className=''>
                      <div className='weather-details-text'>Humidity: {currentWeatherData.humidity}%</div>
                      <div className='weather-details-text'>Wind: {currentWeatherData.wind_speed} {currentUnit === 'metric' ? 'mps' : 'mph'}</div>
                      <div className='weather-details-text'>Feels like: {convertTemp(currentWeatherData.feels_like)}°</div>
                    </Col>
                  </Row> : null
                }
                <div className='mt-3'>
                  {
                    currentCityHourlyWeatherData.length ? <div className='todays-weather-forecast-container'>
                      {
                        currentCityHourlyWeatherData.filter(weatherData => ConvertTime(weatherData.dt, currentCityTimezoneOffset)
                          .isSame(ConvertTime(currentWeatherData.dt, currentCityTimezoneOffset), 'day')).map((todayWeatherData, index) => <div key={index} className='col today-weather-container'>
                            <div>
                              <img src={`/assets/weather/${getWeatherIcon(todayWeatherData, currentWeatherData.sunrise, currentWeatherData.sunset, currentCityTimezoneOffset)}.svg`} />
                            </div>
                            <div>
                              {convertTemp(todayWeatherData.temp)}
                            </div>
                            <div>
                              {ConvertTime(todayWeatherData.dt, currentCityTimezoneOffset).format('hh:mm A')}
                            </div>
                          </div>)
                      }
                    </div> : null
                  }
                </div>
                <div className='mt-3'>
                  {
                    currentCityDailyWeatherData.length ? <Row className='m-0'>
                      {
                        currentCityDailyWeatherData.map((weatherData, index) => <Col key={index} className='text-center'>
                          <h5 className='mb-0'>{ConvertTime(weatherData.dt, currentCityTimezoneOffset).format('ddd')}</h5>
                          <div>
                            <img src={`/assets/weather/${getWeatherIcon(weatherData, currentWeatherData.sunrise, currentWeatherData.sunset, currentCityTimezoneOffset)}.svg`} />
                          </div>
                          <div>
                            <div className='d-flex flex-row justify-content-center'>
                              <div className='mr-3'>
                                {convertTemp(weatherData.temp.max) + '°'}
                              </div>
                              <div>
                                {convertTemp(weatherData.temp.min) + '°'}
                              </div>
                            </div>
                          </div>
                        </Col>)
                      }
                    </Row> : null
                  }
                </div>
              </div>
            </div> : null
          }
        </div>
      </div>
    </ThemeProvider>
  } else {
    return <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles />
      <div className='app-container p-3 text-center'>
        <h3>Please enable location permission</h3>
      </div>
    </ThemeProvider>
  }
}

export default HomePage