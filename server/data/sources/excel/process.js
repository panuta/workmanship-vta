import _ from 'lodash'

import ExcelReader from './reader'
import { Employee, EmployeeAttendance, Shift } from '../../models/definitions'
import { stringToDate } from '../../utils'

export const processExcelFile = async (sourceFile) => {
  const reader = new ExcelReader(sourceFile.filePath)
  const monthYear = stringToDate(sourceFile.monthYear)

  // Shift
  const shiftData = reader.readShifts()

  await Shift.destroy({ where: {} })
  await Shift.bulkCreate(shiftData)

  // Employee
  const employeeData = reader.readEmployees()

  await Employee.destroy({ where: {} })
  await Employee.bulkCreate(employeeData)

  // Employee Time Attendance
  const employeeAttendanceMapping = {}  // [code, date] => { ... }

  const employeesShiftsDataList = reader.readEmployeesShifts()
  employeesShiftsDataList.forEach(employeeShiftsData => {
    const employeeCode = employeeShiftsData.code
    _.range(1, 32).forEach(date => {
      // const attendanceDate = new Date(monthYear.getFullYear(), monthYear.getMonth(), date)
      if(_.has(employeeShiftsData, date)) {
        _.set(employeeAttendanceMapping, [`${employeeCode}:${date}`, 'shift'], employeeShiftsData[date])
      }
    })
  })

  const employeesInputDailyDataList = reader.readEmployeesInputDaily()
  employeesInputDailyDataList.forEach(employeeInputDailyData => {
    const employeeCode = employeeInputDailyData.code
    _.range(1, 32).forEach(date => {
      // const attendanceDate = new Date(monthYear.getFullYear(), monthYear.getMonth(), date)

      const setValue = name => {
        const key = `${date}.${name}`
        if(_.has(employeeInputDailyData, key) && employeeInputDailyData[key] !== null)
          _.set(employeeAttendanceMapping, [`${employeeCode}:${date}`, name], employeeInputDailyData[key])
      }

      setValue('compensation')
      setValue('usedCompensation')
      // => ADD MORE HERE <=
    })
  })

  const persistingValues = Object.entries(employeeAttendanceMapping).map(([key, attendanceValues]) => {
    const [employeeCode, attendanceDay] = key.split(':', 2)
    return {
      code: employeeCode,
      attendanceDate: new Date(monthYear.getFullYear(), monthYear.getMonth(), parseInt(attendanceDay, 10)),
      ...attendanceValues
    }
  })

  await EmployeeAttendance.bulkCreate(persistingValues, { updateOnDuplicate: ['shift'] })
}
