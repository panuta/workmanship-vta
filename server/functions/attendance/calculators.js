import _ from 'lodash'
import { isUntilAttendanceMonth, sameAttendanceMonth } from '../../utils/attendanceMonth'

export const increaseByValueUntilAttendanceMonth = (attendance, currentValue, attendanceMonth, valueKey) => {
  // eslint-disable-next-line no-param-reassign
  if(_.isNil(currentValue)) currentValue = 0

  const value = attendance[valueKey]
  if(_.isNumber(value) && isUntilAttendanceMonth(attendance.attendanceDate, attendanceMonth)) {
    return currentValue + value
  }
  return currentValue
}

export const increaseByValueOnAttendanceMonth = (attendance, currentValue, attendanceMonth, valueKey) => {
  // eslint-disable-next-line no-param-reassign
  if(_.isNil(currentValue)) currentValue = 0

  const value = attendance[valueKey]
  if(_.isNumber(value) && sameAttendanceMonth(attendance.attendanceDate, attendanceMonth)) {
    return currentValue + value
  }
  return currentValue
}

export const increaseWhenShiftMatchedUntilAttendanceMonth = (attendance, currentValue, attendanceMonth, shiftNames) => {
  // eslint-disable-next-line no-param-reassign
  if(_.isNil(currentValue)) currentValue = 0

  if(shiftNames.includes(attendance.shift) && isUntilAttendanceMonth(attendance.attendanceDate, attendanceMonth)) {
    return currentValue + 1
  }
  return currentValue
}

/**
 * Increase value by 1 when attendance shift is one of shiftNames
 *
 * @param attendance => Employee attendance data
 * @param shiftNames: Array<String>
 * @param currentValue: Integer
 * @param attendanceMonth
 * @return {*}
 */
export const increaseWhenShiftMatchedOnAttendanceMonth = (attendance, currentValue, attendanceMonth, shiftNames) => {
  // eslint-disable-next-line no-param-reassign
  if(_.isNil(currentValue)) currentValue = 0

  if(shiftNames.includes(attendance.shift) && sameAttendanceMonth(attendance.attendanceDate, attendanceMonth)) {
    return currentValue + 1
  }
  return currentValue
}

/**
 * Increase value by 1 when attendance shift is NOT one of shiftNames
 *
 * @param attendance => Employee attendance data
 * @param shiftNames: Array<String>
 * @param currentValue: Integer
 * @param attendanceMonth
 * @return {*}
 */
export const increaseWhenShiftNotMatchedOnAttendanceMonth = (attendance, currentValue, attendanceMonth, shiftNames) => {
  // eslint-disable-next-line no-param-reassign
  if(_.isNil(currentValue)) currentValue = 0

  if(!shiftNames.includes(attendance.shift) && sameAttendanceMonth(attendance.attendanceDate, attendanceMonth)) {
    return currentValue + 1
  }
  return currentValue
}
