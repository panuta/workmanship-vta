import _ from 'lodash'
import dayjs from 'dayjs'
import { Op } from 'sequelize'
import { EmployeeAttendance } from '../models'
import { findEmployees } from './employee'

export const getEmployeeAttendances = async (attendanceMonth) => {
  const date = dayjs(attendanceMonth)
  const attendanceStart = date.startOf('month').toDate()
  const attendanceEnd = date.endOf('month').toDate()

  return EmployeeAttendance.findAll({
    where: {
      attendanceDate: {
        [Op.between]: [attendanceStart, attendanceEnd]
      }
    }
  })
}

export const getMonthlyEmployeesAttendances = async (attendanceMonth) => {
  const activeEmployees = await findEmployees(attendanceMonth)
  const employeesAttendances = await getEmployeeAttendances(attendanceMonth)

  // Convert list of employees to employee mapping
  const employeeMapping = activeEmployees.reduce((accumulator, employee) => {
    accumulator[employee.code] = {
      employee,
      notice: 0,
      vacation: 0,
      sickLeave: 0,
      casualLeave: 0,
      compensation: 0,
      minutesLate: 0,
      minutesEarlyLeave: 0,
      noShow: 0,
      diligenceAllowance: 0,
    }
    return accumulator
  }, {})

  employeesAttendances.forEach(employeeAttendance => {
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

  // TODO => Get data between 26-25 each month

}
