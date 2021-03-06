import { toMomentObject } from './date'

export const monthPeriod = (attendanceMonth) => {
  try {
    return [
      attendanceMonth.clone().subtract(1, 'months').date(26),
      attendanceMonth.clone().date(25)
    ]
  } catch (err) {
    return null
  }
}

export const annualPeriod = (attendanceMonth) => {
  try {
    return [
      attendanceMonth.clone().subtract(1, 'years').month(11).date(26),
      attendanceMonth.clone().month(11).date(25)
    ]
  } catch (err) {
    return null
  }
}

/**
 * Given date, find attendanceMonth for that date
 *
 * @param date: Date or moment.Moment or String
 * @returns {null|moment.Moment}
 */
export const findAttendanceMonth = (date) => {
  const momentObject = toMomentObject(date)
  if(momentObject === null) return null

  if(momentObject.date() >= 26) {
    return momentObject.add(1, 'months').date(1).startOf('day')
  }
  return momentObject.date(1).startOf('day')
}

export const toAttendanceMonth = (year, month) => {
  return findAttendanceMonth(new Date(Date.UTC(year, month, 1)))
}

/**
 * Given date, return true if date is in start date and end date of attendanceMonth
 * @param date: Date or moment.Moment or String
 * @param attendanceMonth
 */
export const sameAttendanceMonth = (date, attendanceMonth) => {
  const momentObject = toMomentObject(date)
  if(momentObject === null) return false

  const [start, end] = monthPeriod(attendanceMonth)
  return momentObject.isBetween(start, end, 'day', '[]')
}

export const isUntilAttendanceMonth = (date, attendanceMonth) => {
  const momentObject = toMomentObject(date)
  if(momentObject === null) return false

  const [, end] = monthPeriod(attendanceMonth)
  return momentObject.isSameOrBefore(end)
}

export const attendanceMonthDates = (attendanceMonth) => {
  const [startPeriod, endPeriod] = monthPeriod(attendanceMonth)

  const dates = []
  while(startPeriod.isSameOrBefore(endPeriod)) {
    dates.push(startPeriod.clone())
    startPeriod.add(1, 'day')
  }
  return dates
}
