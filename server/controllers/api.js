import { log } from '../log'

import { processExcelFile } from '../data/sources/excel/process'
import { InvalidRequestError, MissingAttributesError } from '../errors'
import { getMonthlyEmployeeAttendances } from '../data'
import { uploadExcelFile } from '../data/sources/excel/uploader'

export const uploadFile = async (req, res, next) => {
  throw new MissingAttributesError('No files were uploaded')

  if (!req.files || Object.keys(req.files).length === 0) {
    throw new MissingAttributesError('No files were uploaded')
  }

  const sourceFile = await uploadExcelFile(new Date(2020, 7), req.files.file)
  await processExcelFile(sourceFile)

  res.status(200).json({})
}

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
