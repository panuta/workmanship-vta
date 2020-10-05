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
