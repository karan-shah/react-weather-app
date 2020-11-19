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

export default getWeatherDataByLatLng