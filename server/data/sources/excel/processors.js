import _ from 'lodash'
import { Op } from 'sequelize'

import ExcelReader from './reader'
import { Employee, EmployeeAttendance, Shift } from '../../models'
import { getEmployees } from '../../functions/employee'
import { toMomentObject } from '../../../utils/date'
import { findAttendanceMonth } from '../../../utils/attendanceMonth'
import { generatePayrollFiles } from '../../../libs/payroll'

/**
 * Read employees' attendances data from Excel file and store it to database
 *
 * @param reader: ExcelReader
 * @param fromDate: moment.Moment
 * @param toDate: moment.Moment
 * @returns {Promise<void>}
 * @private
 */
const _processData = async (reader, fromDate, toDate) => {
  const fromDateNumber = fromDate.date()
  const toDateNumber = toDate.date()

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
      setValue('minutesEarlyLeave')
      setValue('overtime')
      setValue('compensation')
      setValue('notice')
    })
  })

  // Combine Schedules and Input Daily
  const employeesAttendances = Object.entries(employeeAttendanceMapping)
    .map(([key, attendanceValues]) => {
      const [employeeCode, dateString] = key.split(':', 2)
      return {
        code: employeeCode,
        attendanceDate: fromDate.clone().date(dateString).toDate(),
        ...attendanceValues
      }
    })

  await EmployeeAttendance.bulkCreate(employeesAttendances, {
    updateOnDuplicate: ['shift', 'minutesLate', 'minutesEarlyLeave', 'overtime', 'compensation', 'notice']
  })

  // Clean up employees' attendances after terminationDate
  const deletePromises = [];
  (await getEmployees())
    .filter(employee => employee.terminationDate !== null)
    .forEach(employee => {
      const terminationDate = toMomentObject(employee.terminationDate)
      deletePromises.push(EmployeeAttendance.destroy({
        where: {
          code: employee.code,
          attendanceDate: {
            [Op.gt] : terminationDate.toDate()
          }
        }
      }))
    })

  await Promise.all(deletePromises)
}

export const processDailySourceFile = async (sourceFile) => {
  const reader = new ExcelReader(sourceFile.filePath)
  const dataSourceDate = toMomentObject(sourceFile.dataSourceDate)
  await _processData(reader, dataSourceDate, dataSourceDate)

  const attendanceMonth = findAttendanceMonth(dataSourceDate)
  await generatePayrollFiles(attendanceMonth)
}

export const processMonthlySourceFile = async (sourceFile, fromDate, toDate) => {
  const reader = new ExcelReader(sourceFile.filePath)
  await _processData(reader, fromDate, toDate)

  // TODO => It's possible to have 2 attendance months

  const attendanceMonth = findAttendanceMonth(dataSourceDate)
  await generatePayrollFiles(attendanceMonth)
}
