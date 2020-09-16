import { processExcelFile } from '../data/sources/excel/process'
import { InvalidRequestError, MissingAttributesError } from '../errors'
import { getMonthlyEmployeeAttendances } from '../data'
import { uploadExcelFile } from '../data/sources/excel/uploader'
import { SourceFile } from '../data/models/definitions'

const _parseMonthYearQuery = (requestQuery) => {
  const { month, year } = requestQuery
  if(month === undefined || year === undefined) {
    throw new MissingAttributesError('Require month and year query parameter')
  }

  try {
    return new Date(year, month - 1, 1)
  } catch (error) {
    throw new InvalidRequestError('Month and/or year is invalid')
  }
}

export const employeeAttendances = async (req, res, next) => {
  const monthYear = _parseMonthYearQuery(req.query)

  const sourceFile = await SourceFile.findOne({ where: { monthYear, isSelected: true } })

  if(sourceFile !== null) {
    const monthlyEmployeeAttendances = await getMonthlyEmployeeAttendances(monthYear)
    res.status(200).json({
      sourceId: sourceFile.sourceId,
      sourceFilename: sourceFile.originalFilename,
      sourceUploadedDatetime: sourceFile.uploadedDatetime,
      employees: monthlyEmployeeAttendances
    })
  } else {
    res.status(200).json({
      sourceFilename: null,
      sourceUploadedDatetime: null,
      employees: []
    })
  }
}

export const uploadFile = async (req, res, next) => {
  const monthYear = _parseMonthYearQuery(req.query)

  if (!req.files || Object.keys(req.files).length === 0) {
    throw new MissingAttributesError('No files were uploaded')
  }

  const sourceFile = await uploadExcelFile(monthYear, req.files.file)
  await processExcelFile(sourceFile)

  await SourceFile.update({ isSelected: false }, {
    where: {
      monthYear
    }
  })

  sourceFile.isSelected = true
  await sourceFile.save()

  res.status(200).json({})
}
