import { parseMonthYearQueryParameter } from '../utils/queryParser'
import { getOrCreatePayrollFile, sanitizeFileType } from '../libs/payroll'
import { NotFoundError } from '../errors'

export const downloadPayrollFile = async (req, res, next) => {
  const attendanceMonth = parseMonthYearQueryParameter(req.query)
  const { file: fileType } = req.query
  const cleanFileType = sanitizeFileType(fileType)

  if(cleanFileType === null) {
    throw new NotFoundError('File Type not found')
  }

  const payrollFilePath = await getOrCreatePayrollFile(attendanceMonth, cleanFileType)
  res.download(payrollFilePath)
}
