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
  const employeeShiftDataList = reader.readEmployeeShifts()

  const values = []
  employeeShiftDataList.forEach(employeeShiftData => {
    _.range(1, 32).forEach(date => {
      const value = {
        code : employeeShiftData.code,
        attendanceDate: new Date(monthYear.getFullYear(), monthYear.getMonth(), date),
        shift: employeeShiftData[date]
      }

      values.push(value)
    })
  })

  await EmployeeAttendance.bulkCreate(values, { updateOnDuplicate: ['shift'] })
}
