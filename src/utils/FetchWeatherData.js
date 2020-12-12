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

const getWeatherDataUsingOneCallByLatLng = (lat, lon, units = 'metric') => {
  apiInstance.get('/onecall', {
    params: {
      lat,
      lon,
      appid: process.env.REACT_APP_API_KEY,
      units
    }
  }).then((data) => data.data).catch((error) => error)
}

const getWeatherDataUsingOneCallByCity = (city, units = 'metric') => {
  apiInstance.get('/onecall', {
    params: {
      appid: process.env.REACT_APP_API_KEY,
      q: city,
      units
    }
  }).then((data) => data.data).catch((error) => error)
}

export { fetchWeatherDataByLatLng, fetchWeatherDataByCity, getWeatherDataUsingOneCallByLatLng, getWeatherDataUsingOneCallByCity }