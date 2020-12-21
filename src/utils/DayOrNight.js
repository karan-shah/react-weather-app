import moment from 'moment'

const DayOrNight = (sunriseTime, sunsetTime, currentTime) => {
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

export default DayOrNight