import { parseMonthYearQueryParameter } from '../libs/queryParser'
import { getMonthlyEmployeesAttendances } from '../data/functions/employeeAttendances'

export const employeesAttendancesPageController = async (req, res, next) => {
  const attendanceMonth = parseMonthYearQueryParameter(req.query)

  const result = getMonthlyEmployeesAttendances(attendanceMonth)

  // TODO : Send back latest data updated

  res.status(200).json({
    latestDataSourceDate: '2020-09-20',
    employees: []
  })

  // if(await hasSourceFileByDate(dataSourceDate)) {
  //
  //   /*
  //   const monthlyEmployeeAttendances = await getMonthlyEmployeeAttendances(monthYear)
  //   res.status(200).json({
  //     sourceId: sourceFile.sourceId,
  //     sourceFilename: sourceFile.originalFilename,
  //     sourceUploadedDatetime: sourceFile.uploadedDatetime,
  //     employees: monthlyEmployeeAttendances
  //   })
  //    */
  //
  //   res.status(200).json({
  //     sourceFilename: null,
  //     sourceUploadedDatetime: null,
  //     employees: []
  //   })
  // } else {
  //   res.status(200).json({
  //     sourceFilename: null,
  //     sourceUploadedDatetime: null,
  //     employees: []
  //   })
  // }
}
