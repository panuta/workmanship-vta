import { processExcelFile } from '../data/sources/excel/processors'

export const getMonthlyAttendance = async (req, res, next) => {
  await processExcelFile()

  res.status(200).json({})
}
