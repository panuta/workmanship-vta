import moment from 'moment'
import { config as appConfig } from '../config'
import { InvalidRequestError, MissingAttributesError } from '../errors'
import { uploadExcelFile } from '../data/sources/excel/uploader'
import { hasSourceFileByDate, upsertSourceFile } from '../data/functions/sourceFile'
import { processDailySourceFile, processMonthlySourceFile } from '../data/sources/excel/processors'
import { parseDateQueryParameter } from '../utils/queryParser'

export const uploadDailyFile = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new MissingAttributesError('No file were uploaded')
  }

  const dataSourceDate = moment.utc().subtract(1, 'days').startOf('day')

  // Check if source file for this uploadDate is already existed
  if(!appConfig.allowReplaceDailyUpload && await hasSourceFileByDate(dataSourceDate)) {
    throw new MissingAttributesError("Not allow to replace file that is already uploaded")
  }

  // Persist file to file systems
  const uploadFile = req.files.file
  const uploadedFilePath = await uploadExcelFile(dataSourceDate, uploadFile)

  // Create file record on DB
  const [sourceFile, ] = await upsertSourceFile(dataSourceDate, uploadedFilePath, uploadFile.name)

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

  // Persist file to file systems
  const uploadFile = req.files.file
  const uploadedFilePath = await uploadExcelFile([fromDate, toDate], uploadFile)

  // Create file record on DB
  const insertPromises = [];
  for (const d = fromDate.clone(); d.diff(toDate, 'days') <= 0; d.add(1, 'day')) {
    insertPromises.push(upsertSourceFile(d, uploadedFilePath, uploadFile.name))
  }
  const upsertResults = await Promise.all(insertPromises)

  // Process uploaded Excel file
  const [sourceFile, ] = upsertResults[0]
  await processMonthlySourceFile(sourceFile, fromDate, toDate)

  res.status(200).json({ status: 'SUCCESS' })
}
