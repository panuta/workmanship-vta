import _ from 'lodash'
import path from 'path'

import ExcelReader from './reader'
import { Employee, EmployeeAttendance, Shift } from '../../models/definitions'

export const processExcelFile = async () => {
  const reader = new ExcelReader(path.resolve(__dirname, '../../../resources/input-08-63-small.xlsx'))

  const currentMonth = new Date(2020, 7)

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
        attendanceDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date),
        shift: employeeShiftData[date]
      }

      values.push(value)
    })
  })

  await EmployeeAttendance.bulkCreate(values, { updateOnDuplicate: ['shift'] })

}
