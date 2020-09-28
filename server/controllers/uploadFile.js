import moment from 'moment'
import { config as appConfig } from '../config'
import { InvalidRequestError, MissingAttributesError } from '../errors'
import { uploadExcelFile } from '../data/sources/excel/uploader'
import { hasSourceFileByDate, insertSourceFile } from '../data/functions/sourceFile'
import { processDailySourceFile } from '../data/sources/excel/processors'
import { parseDateQueryParameter, parseMonthYearQueryParameter } from '../utils/queryParser'

export const uploadDailyFile = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new MissingAttributesError('No file were uploaded')
  }

  const dataSourceDate = moment().subtract(1, 'days').startOf('day')

  // Check if source file for this uploadDate is already existed
  if(!appConfig.allowReplaceDailyUpload && await hasSourceFileByDate(dataSourceDate)) {
    throw new MissingAttributesError("Not allow to replace file that is already uploaded")
  }

  // Persist file to file systems
  const uploadFile = req.files.file
  const uploadedFilePath = await uploadExcelFile(dataSourceDate, uploadFile)

  // Create file record on DB
  const sourceFile = await insertSourceFile(dataSourceDate, uploadedFilePath, uploadFile.name)

  // Process uploaded Excel file
  // TODO => Backup database before process
  await processDailySourceFile(sourceFile)

  res.status(200).json({ status: 'SUCCESS' })
}

export const uploadMonthlyFile = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new MissingAttributesError('No file were uploaded')
  }

  const fromDate = parseDateQueryParameter(req.query, 'from')
  const toDate = parseDateQueryParameter(req.query, 'to')

  if(!fromDate.isSame(toDate, 'month')) {
    throw new InvalidRequestError('Dates must be in the same month')
  }

  // TODO : Check password

  const attendanceMonth = fromDate.startOf('month')

  // Persist file to file systems
  const uploadFile = req.files.file
  const uploadedFilePath = await uploadExcelFile(attendanceMonth, uploadFile)

  // Create file record on DB
  const insertPromises = [];
  for (const d = fromDate; d.diff(toDate, 'days') <= 0; d.add(1, 'day')) {
    insertPromises.push(insertSourceFile(d.toDate(), uploadedFilePath, uploadFile.name))
  }
  await Promise.all(insertPromises)

  res.status(200).json({ status: 'SUCCESS' })
}
