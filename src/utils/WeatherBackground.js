import ConvertTime from './ConvertTime'
import DayOrNight from './DayOrNight'

const getWeatherBackground = (weatherData, timezoneOffset) => {
  const { weather } = weatherData
  const { main: weatherType } = weather[0]
  const sunriseTime = ConvertTime(weatherData.sunrise, timezoneOffset)
  const sunsetTime = ConvertTime(weatherData.sunset, timezoneOffset)
  const currentTime = ConvertTime(weatherData.dt, timezoneOffset)

  const type = DayOrNight(sunriseTime, sunsetTime, currentTime)

  if (weatherType) {
    if (weatherType === 'Clear') {
      return type === 'day' ? 'clear-day' : 'clear-night'
    } else if (weatherType === 'Rain') {
      return `overcast-${type}`
    } else if (weatherType === 'Atmosphere') {
      return `cloudy-${type}`
    } else if (weatherType === 'Clouds') {
      return `cloudy-${type}`
    } else if (weatherType === 'Mist') {
      return `cloudy-${type}`
    } else if (weatherType === 'Snow') {
      return `overcast-${type}`
    } else if (weatherType === 'Drizzle') {
      return `overcast-${type}`
    } else if (weatherType === 'Thunderstorm') {
      return 'thunderstorm'
    } else {
      return type === 'day' ? 'clear-day' : 'clear-night'
    }
  } else {
    return type === 'day' ? 'clear-day' : 'clear-night'
  }
}

export default getWeatherBackground