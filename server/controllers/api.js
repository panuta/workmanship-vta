import _ from 'lodash'
import moment from 'moment'

import { parseMonthYearQueryParameter } from '../utils/queryParser'
import { getMonthlyEmployeesAttendances } from '../data/functions/employeeAttendance'
import { getMonthlySourceFiles } from '../data/functions/sourceFile'
import { Employee, EmployeeAttendance, Shift, SourceFile } from '../data/models'
import { attendanceMonthDates, findAttendanceMonth } from '../utils/attendanceMonth'

export const employeesAttendancesPage = async (req, res, next) => {
  const attendanceMonth = parseMonthYearQueryParameter(req.query)

  const employees = await getMonthlyEmployeesAttendances(attendanceMonth)

  const sourceFiles = await getMonthlySourceFiles(attendanceMonth)
  const sourceDates = sourceFiles.map(sourceFile => sourceFile.dataSourceDate)

  res.status(200).json({
    sourceDates,
    employees
  })
}

export const listPayrollFiles = async (req, res, next) => {
  const START_ATTENDANCE_MONTH = moment.utc({ year: 2020, month: 7, day: 1 })
  const currentAttendanceMonth = findAttendanceMonth(moment.utc())

  const payrollFiles = []
  while(currentAttendanceMonth.isSameOrAfter(START_ATTENDANCE_MONTH)) {
    // eslint-disable-next-line no-await-in-loop
    const monthlySourceFiles = await getMonthlySourceFiles(currentAttendanceMonth)

    // Check if there're dates which has no SourceFile
    const noDataDates = _.difference(
      attendanceMonthDates(currentAttendanceMonth).map(date => date.format('YYYY-MM-DD')),
      monthlySourceFiles.map(sourceFile => sourceFile.dataSourceDate)
    )

    payrollFiles.push({
      attendanceMonth: currentAttendanceMonth.format('YYYY-MM-DD'),
      status: noDataDates.length === 0 ? 'available' : 'incomplete'
    })

    currentAttendanceMonth.subtract(1, 'months')
  }

  res.status(200).json({
    payrollFiles
  })
}

export const deleteEverything = async (req, res, next) => {
  await SourceFile.destroy({ truncate: true })
  await Shift.destroy({ truncate: true })
  await Employee.destroy({ truncate: true })
  await EmployeeAttendance.destroy({ truncate: true })

  res.status(200).json({
    status: 'OK'
  })
}

