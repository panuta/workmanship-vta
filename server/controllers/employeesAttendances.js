import { parseMonthYearQueryParameter } from '../utils/queryParser'
import { getMonthlyEmployeesAttendances } from '../data/functions/employeeAttendance'
import { getLatestSourceFile } from '../data/functions/sourceFile'

export const employeesAttendancesPageController = async (req, res, next) => {
  const attendanceMonth = parseMonthYearQueryParameter(req.query)

  const latestDataSourceDate = await getLatestSourceFile()
  const employees = await getMonthlyEmployeesAttendances(attendanceMonth)

  res.status(200).json({
    latestDataSourceDate: latestDataSourceDate === 0 ? null : latestDataSourceDate,
    employees
  })
}
