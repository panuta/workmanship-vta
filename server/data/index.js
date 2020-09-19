import _ from 'lodash'
import { findEmployeeAttendances, findEmployees } from './models'

export const getMonthlyEmployeeAttendances = async (attendanceMonth) => {
  const employees = await findEmployees(attendanceMonth)
  const employeeAttendances = await findEmployeeAttendances(attendanceMonth)

  // Convert list of employees to employee mapping
  const employeeMapping = employees.reduce((accumulator, employee) => {
    accumulator[employee.code] = {
      employee,
      vacation: 0,
      sickLeave: 0,
      casualLeave: 0,
      compensation: 0,
      usedCompensation: 0,
      forceBreak: 0,
      returnedForceBreak: 0,
      minuteLate: 0,
      minuteEarlyLeave: 0,
      noShow: 0,
      diligenceAllowance: 0,
      // => ADD MORE HERE <=
    }
    return accumulator
  }, {})

  employeeAttendances.forEach(employeeAttendance => {
    // Only for employees that is valid within this month
    if(_.has(employeeMapping, [employeeAttendance.code])) {
      const increaseWhenShiftIs = (shiftName, valueName) => {
        if(employeeAttendance.shift === shiftName) {
          employeeMapping[employeeAttendance.code][valueName] += 1
        }
      }

      const increaseByValue = (valueName) => {
        if(_.isNumber(employeeAttendance[valueName])) {
          employeeMapping[employeeAttendance.code][valueName] += employeeAttendance[valueName]
        }
      }

      increaseWhenShiftIs('พักร้อน', 'vacation')
      increaseWhenShiftIs('ลาป่วย', 'sickLeave')
      increaseWhenShiftIs('ลากิจ', 'casualLeave')

      increaseByValue('compensation')
      increaseByValue('usedCompensation')
      increaseByValue('forceBreak')
      increaseByValue('returnedForceBreak')
      increaseByValue('minuteLate')
      increaseByValue('minuteEarlyLeave')
      increaseByValue('noShow')
      increaseByValue('diligenceAllowance')

      // => ADD MORE HERE <=
    }
  })

  return Object.values(employeeMapping).map(employeeData => {
    const employeeDict = employeeData.employee.toJSON()
    return Object.assign(employeeDict, _.omit(employeeData, ['employee']))
  })
}
