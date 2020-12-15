import moment from 'moment'
import ConvertTime from './ConvertTime'

const isDayNight = (sunriseTime, sunsetTime, currentTime) => {
  if (moment(currentTime).isSameOrBefore(sunriseTime, 'hour')) {
    if (moment(currentTime).isSameOrBefore(sunriseTime, 'minute')) {
      return 'night'
    } else {
      return 'day'
    }
  } else if (moment(currentTime).isSameOrBefore(sunsetTime, 'hour')) {
    if (moment(currentTime).isSameOrBefore(sunsetTime, 'minute')) {
      return 'day'
    } else {
      return 'night'
    }
  } else {
    if (moment(currentTime).isSameOrAfter(sunsetTime, 'minute')) {
      return 'night'
    } else {
      return 'day'
    }
  }
}

const getWeatherIcon = (weatherData, sunrise, sunset, timezoneOffset) => {
  const { weather } = weatherData
  const { main: weatherType } = weather[0]
  const sunriseTime = ConvertTime(sunrise, timezoneOffset)
  const sunsetTime = ConvertTime(sunset, timezoneOffset)
  const currentTime = ConvertTime(weatherData.dt, timezoneOffset)

  const type = isDayNight(sunriseTime, sunsetTime, currentTime)
  if (weatherType) {
    if (weatherType === 'Clear') {
      return type
    } else if (weatherType === 'Rain') {
      return `rain-${type}`
    } else if (weatherType === 'Atmosphere') {
      return `cloudy-${type}`
    } else if (weatherType === 'Clouds') {
      return `cloudy-${type}`
    } else if (weatherType === 'Snow') {
      return `snow-${type}`
    } else if (weatherType === 'Drizzle') {
      return `rain-${type}`
    } else if (weatherType === 'Thunderstorm') {
      return 'thunder'
    } else {
      return type
    }
  } else {
    return type
  }
}

export default getWeatherIcon