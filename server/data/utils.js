import _ from 'lodash'
import moment from 'moment'

export const parseDuration = (text) => {
  const [hoursText, minutesText] = text.split('.')
  try {
    return parseInt(hoursText, 10) * 60 + parseInt(minutesText, 10)
  } catch (error) {
    return null
  }
}

export const dateToString = date => {
  if(moment.isMoment(date)) {
    return date.format('YYYY-MM-DD')
  }
  if(_.isDate(date)) {
    return moment(date).format('YYYY-MM-DD')
  }
  return null
}

/**
 * Create a pair of start date and end date for specific month
 *
 * @param year: Integer - Year
 * @param month: Integer - Zero-indexed month
 * @returns {null|[moment.Moment, moment.Moment]}
 */
export const monthPeriod = (year, month) => {
  try {
    const m = moment({year, month, day: 1}, true)
    return [
      m.clone().subtract(1, 'months').date(26),
      m.date(25)
    ]
  } catch (err) {
    return null
  }
}
