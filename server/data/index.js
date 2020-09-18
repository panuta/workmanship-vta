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
      compensation: 0,
      usedCompensation: 0,
      // => ADD MORE HERE <=
    }
    return accumulator
  }, {})

  employeeAttendances.forEach(employeeAttendance => {
    // Vacation
    if(employeeAttendance.shift === 'พักร้อน') {
      employeeMapping[employeeAttendance.code].vacation += 1
    }

    if(_.isNumber(employeeAttendance.compensation)) {
      employeeMapping[employeeAttendance.code].compensation += employeeAttendance.compensation
    }

    if(_.isNumber(employeeAttendance.usedCompensation)) {
      employeeMapping[employeeAttendance.code].usedCompensation += employeeAttendance.usedCompensation
    }

    // => ADD MORE HERE <=
  })

  return Object.values(employeeMapping).map(employeeData => {
    const employeeDict = employeeData.employee.toJSON()
    return Object.assign(employeeDict, _.omit(employeeData, ['employee']))
  })
}
