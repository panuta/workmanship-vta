import _ from 'lodash'

import { parseMonthYearQueryParameter } from '../utils/queryParser'
import { getMonthlyEmployeesAttendances } from '../data/functions/employeeAttendance'
import { getLatestSourceFile } from '../data/functions/sourceFile'

export const employeesAttendancesPage = async (req, res, next) => {
  const attendanceMonth = parseMonthYearQueryParameter(req.query)

  const latestSourceFile = await getLatestSourceFile()
  const employees = await getMonthlyEmployeesAttendances(attendanceMonth)

  res.status(200).json({
    latestDataSourceDate: _.isNil(latestSourceFile) ? null : latestSourceFile.dataSourceDate,
    employees
  })
}
