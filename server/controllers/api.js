import { processExcelFile } from '../data/sources/excel/process'
import { InvalidRequestError, MissingAttributesError } from '../errors'
import { getMonthlyEmployeeAttendances } from '../data'

export const process = async (req, res, next) => {
  await processExcelFile()
  res.status(200).json({})
}

export const employeeAttendancesTable = async (req, res, next) => {
  const { month, year } = req.query

  if(month === undefined || year === undefined) {
    throw new MissingAttributesError('Require month and year query parameter')
  }

  let activeInMonth
  try {
    activeInMonth = new Date(year, month - 1, 1)
  } catch (error) {
    throw new InvalidRequestError('Month and/or year is invalid')
  }

  const monthlyEmployeeAttendances = await getMonthlyEmployeeAttendances(activeInMonth)

  res.status(200).json({
    data: monthlyEmployeeAttendances
  })
}
