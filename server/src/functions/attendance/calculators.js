import { isNil } from 'lodash'
import { sameAttendanceMonth } from '../../utils/attendanceMonth'
import { parseInteger } from '../../utils/dataType'

export const increaseByValue = (attendance, currentValue, attendanceMonth, valueKey) => {
  const value = parseInteger(attendance[valueKey], 0)
  return !isNil(currentValue) ? currentValue + value : value
}

export const increaseByValueOnAttendanceMonth = (attendance, currentValue, attendanceMonth, valueKey) => {
  if(sameAttendanceMonth(attendance.attendanceDate, attendanceMonth)) {
    const value = parseInteger(attendance[valueKey], 0)
    return !isNil(currentValue) ? currentValue + value : value
  }
  return !isNil(currentValue) ? currentValue : 0
}

export const increaseWhenShiftMatched = (attendance, currentValue, attendanceMonth, shiftNames) => {
  // eslint-disable-next-line no-param-reassign
  if(isNil(currentValue)) currentValue = 0

  if(shiftNames.includes(attendance.shift)) {
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
  if(isNil(currentValue)) currentValue = 0

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
  if(isNil(currentValue)) currentValue = 0

  if(!shiftNames.includes(attendance.shift) && sameAttendanceMonth(attendance.attendanceDate, attendanceMonth)) {
    return currentValue + 1
  }
  return currentValue
}
