import moment from 'moment'
import { config as appConfig } from '../config'
import { MissingAttributesError } from '../errors'
import { uploadExcelFile } from '../data/sources/excel/uploader'
import { hasSourceFileByDate, insertSourceFile } from '../data/functions/sourceFile'
import { processDailySourceFile } from '../data/sources/excel/processors'

export const uploadDailyFileController = async (req, res, next) => {
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

export const uploadMonthlyFileController = async (req, res, next) => {
  // const dataSourceDate = parseDateQueryParameter(req.query, 'date')
}
