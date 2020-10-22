import _ from 'lodash'
import moment from 'moment'

export const utcDate = (year, month, date) => {
  return new Date(Date.UTC(year, month, date))
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

export const timeMinutesDiff = (fromTimeStr, toTimeStr, fallbackValue = null) => {
  try {
    const [fromHourStr, fromMinuteStr] = fromTimeStr.split(':', 2)
    const [toHourStr, toMinuteStr] = toTimeStr.split(':', 2)

    const fromHour = parseInt(fromHourStr, 10)
    const fromMinute = parseInt(fromMinuteStr, 10)
    const toHour = parseInt(toHourStr, 10)
    const toMinute = parseInt(toMinuteStr, 10)

    const fromDateTime = moment.utc({ years: 1970, months: 0, days: 1, hours: fromHour, minutes: fromMinute })
    const toDateTime = moment.utc({ years: 1970, months: 0, days: 1, hours: toHour, minutes: toMinute })

    if(!fromDateTime.isValid() || !toDateTime.isValid()) {
      return fallbackValue
    }

    if(fromDateTime.isAfter(toDateTime)) {
      toDateTime.add(1, 'days')
    }

    return Math.abs(fromDateTime.diff(toDateTime, 'minutes'))
  } catch (error) {
    return fallbackValue
  }
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

export const calculateHoursMinutes = (minutes) => {
  const h = Math.floor(minutes / 60)
  const m = minutes - (h * 60)
  return [h, m]
}
