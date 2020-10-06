import moment from 'moment'

import { parseMonthYearQueryParameter } from '../utils/queryParser'
import { getMonthlyEmployeesAttendances } from '../data/functions/employeeAttendance'
import { getMonthlySourceFiles } from '../data/functions/sourceFile'
import { Employee, EmployeeAttendance, Shift, SourceFile } from '../data/models'
import { findAttendanceMonth } from '../utils/attendanceMonth'

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
  const START_ATTENDANCE_MONTH = moment.utc({ year: 2020, month: 5, day: 1 })
  const currentAttendanceMonth = findAttendanceMonth(moment.utc())

  console.log(START_ATTENDANCE_MONTH)

  while(currentAttendanceMonth.isSameOrAfter(START_ATTENDANCE_MONTH)) {
    console.log(currentAttendanceMonth)
    currentAttendanceMonth.subtract(1, 'months')

    // TODO => Check SourceFile within attendance month
  }

  res.status(200).json({
    status: 'OK'
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

