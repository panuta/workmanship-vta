import _ from 'lodash'
import moment from 'moment'
import { strict as assert } from 'assert'

import ExcelReader from './reader'
import { Employee, EmployeeAttendance, Shift } from '../../models/definitions'

/**
 * Read employees' attendances data from Excel file and store it to database
 *
 * @param sourceFilePath: String - Path to Excel file
 * @param fromDate: Date - Collect Excel data from date
 * @param toDate: Date - Collect Excel data to date
 * @returns {Promise<void>}
 * @private
 */
const _collectAndStoreData = async (sourceFilePath, fromDate, toDate) => {
  assert(fromDate <= toDate)
  assert(fromDate.getMonth() === toDate.getMonth())

  const fromDateNumber = fromDate.getDate()
  const toDateNumber = toDate.getDate()

  const reader = new ExcelReader(sourceFilePath)

  // Shifts
  const shiftData = reader.readShifts()

  await Shift.destroy({ where: {} })
  await Shift.bulkCreate(shiftData)

  // Employees
  const employeeData = reader.readEmployees()

  await Employee.destroy({ where: {} })
  await Employee.bulkCreate(employeeData)

  // Employees Schedules
  const employeeAttendanceMapping = {}  // [code:date] => { ... }

  const employeesShiftsData = reader.readEmployeesShifts(fromDateNumber, toDateNumber)
  employeesShiftsData.forEach(employeeShiftsData => {
    const employeeCode = employeeShiftsData.code
    _.range(1, 32).forEach(date => {
      if(_.has(employeeShiftsData, date)) {
        _.set(employeeAttendanceMapping, [`${employeeCode}:${date}`, 'shift'], employeeShiftsData[date])
      }
    })
  })

  // Employees Input Daily
  const employeesInputDailyData = reader.readEmployeesInputDaily(fromDateNumber, toDateNumber)
  employeesInputDailyData.forEach(employeeInputDailyData => {
    const employeeCode = employeeInputDailyData.code
    _.range(1, 32).forEach(date => {

      const setValue = name => {
        const key = `${date}.${name}`
        if(_.has(employeeInputDailyData, key) && employeeInputDailyData[key] !== null)
          _.set(employeeAttendanceMapping, [`${employeeCode}:${date}`, name], employeeInputDailyData[key])
      }

      setValue('minutesLate')
      setValue('minutesEarlyLeft')
      setValue('overtime')
      setValue('compensation')
      setValue('notice')
    })
  })

  // Combine Schedules and Input Daily
  const employeesAttendances = Object.entries(employeeAttendanceMapping).map(([key, attendanceValues]) => {
    const [employeeCode, attendanceDay] = key.split(':', 2)
    return {
      code: employeeCode,
      attendanceDate: new Date(fromDate.getFullYear(), fromDate.getMonth(), parseInt(attendanceDay, 10)),
      ...attendanceValues
    }
  })

  await EmployeeAttendance.bulkCreate(employeesAttendances, {
    updateOnDuplicate: ['shift', 'minutesLate', 'minutesEarlyLeft', 'overtime', 'compensation', 'notice']
  })
}

export const processDailySourceFile = async (sourceFile) => {
  const dataSourceDate = moment(sourceFile.dataSourceDate).toDate()
  await _collectAndStoreData(
    sourceFile.filePath,
    dataSourceDate,
    dataSourceDate)
}

export const processMonthlySourceFile = async (sourceFile, fromDate, toDate) => {
  // TODO : How to accept sourceFile, is it a list of file or single file
  // TODO => Then how to store it => store multiplre SourceFile row but point to the same file
}
