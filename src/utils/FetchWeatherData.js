import apiInstance from '../api'

const fetchWeatherDataByLatLng = async (lat, lon, units = 'metric') => {
  try {
    const res = await apiInstance.get('/weather', {
      params: {
        appid: process.env.REACT_APP_API_KEY,
        lat,
        lon,
        units
      }
    })
    return res.data
  } catch (e) {
    return e
  }
}

const fetchWeatherDataByCity = async (city, units = 'metric') => {
  try {
    const res = await apiInstance.get('/weather', {
      params: {
        appid: process.env.REACT_APP_API_KEY,
        q: city,
        units
      }
    })
    return res.data
  } catch (e) {
    return e
  }
}

const fetchWeatherDataUsingOneCall = async (lat, lon, units = 'metric') => {
  try {
    const res = await apiInstance.get('/onecall', {
      params: {
        lat,
        lon,
        exclude: 'minutely',
        appid: process.env.REACT_APP_API_KEY,
        units
      }
    })
    return res.data
  } catch (e) {
    return e
  }
}

export { fetchWeatherDataByLatLng, fetchWeatherDataByCity, fetchWeatherDataUsingOneCall }