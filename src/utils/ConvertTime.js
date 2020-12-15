import moment from 'moment'

const ConvertTime = (time, timezoneOffset) => {
  return moment.unix(time).utc().add(timezoneOffset, 's')
}

export default ConvertTime