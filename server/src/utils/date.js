import _ from 'lodash'
import moment from 'moment'

export const parseDuration = (text, delimiter) => {
  let hoursText
  let minutesText
  if(delimiter === undefined) {
    if(text.indexOf('.') !== -1) {
      [hoursText, minutesText] = text.split('.')
    } else if(text.indexOf(':') !== -1) {
      [hoursText, minutesText] = text.split(':')
    } else {
      hoursText = "0"
      minutesText = text
    }
  } else {
    [hoursText, minutesText] = text.split(delimiter)
  }

  try {
    return parseInt(hoursText, 10) * 60 + parseInt(minutesText, 10)
  } catch (error) {
    return null
  }
}

export const toMomentObject = (date, defaultParsingFormat = 'YYYY-MM-DD') => {
  if(_.isNil(date)) return null
  if(moment.isMoment(date)) return date.clone()
  if(_.isDate(date)) return moment.utc(date).startOf('day')
  if(_.isString(date)) {
    try {
      const parsed = moment.utc(date, defaultParsingFormat, true)
      if(parsed.isValid()) return parsed
    } catch (err) {
      return null
    }
  }
  return null
}

export const dateToString = date => {
  const momentObject = toMomentObject(date)
  if(momentObject !== null) return momentObject.format('YYYY-MM-DD')
  return null
}

/**
 * Generate dates within a month
 *
 * @param month: Moment object
 * @return Array of Moment object
 */
export const generateMonthlyDate = (month) => {
  const startOfMonth = month.clone().startOf('month').startOf('day')
  const endOfMonth = startOfMonth.clone().endOf('month')

  const dates = []
  while(startOfMonth.isSameOrBefore(endOfMonth)) {
    dates.push(startOfMonth.clone())
    startOfMonth.add(1, 'day')
  }
  return dates
}
