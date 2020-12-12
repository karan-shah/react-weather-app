import apiInstance from '../api'

const getWeatherDataByLatLng = (lat, lon, units = 'metric') => {
  apiInstance.get('/weather', {
    params: {
      appid: process.env.API_KEY,
      lat,
      lon,
      units
    }
  }).then((data) => data.data).catch((error) => error)
}

const getWeatherDataByCity = (city, units = 'metric') => {
  apiInstance.get('/weather', {
    params: {
      appid: process.env.API_KEY,
      q: city,
      units
    }
  }).then((data) => data.data).catch((error) => error)
}

const getWeatherDataUsingOneCallByLatLng = (lat, lon, units = 'metric') => {
  apiInstance.get('/onecall', {
    params: {
      lat,
      lon,
      appid: process.env.API_KEY,
      units
    }
  }).then((data) => data.data).catch((error) => error)
}

const getWeatherDataUsingOneCallByCity = (city, units = 'metric') => {
  apiInstance.get('/onecall', {
    params: {
      appid: process.env.API_KEY,
      q: city,
      units
    }
  }).then((data) => data.data).catch((error) => error)
}

export { getWeatherDataByLatLng, getWeatherDataByCity, getWeatherDataUsingOneCallByLatLng, getWeatherDataUsingOneCallByCity }