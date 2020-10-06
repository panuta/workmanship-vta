import { parseMonthYearQueryParameter } from '../utils/queryParser'
import { getMonthlyEmployeesAttendances } from '../data/functions/employeeAttendance'
import { getMonthlySourceFiles } from '../data/functions/sourceFile'

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
