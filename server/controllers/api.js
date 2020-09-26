import { InvalidRequestError, MissingAttributesError } from '../errors'
import { getMonthlyEmployeeAttendances } from '../data'
import { SourceFile } from '../data/models'

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
