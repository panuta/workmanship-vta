import { MissingAttributesError } from '../errors'
import { uploadExcelFile } from '../data/sources/excel/uploader'
import { parseDateQueryParameter } from '../libs/queryParser'
import { hasSourceFileByDate, insertSourceFile } from '../data/functions/sourceFile'
import { processSourceFile } from '../data/sources/excel/processor'

export const uploadFileController = async (req, res, next) => {
  const dataSourceDate = parseDateQueryParameter(req.query, 'date')

  if (!req.files || Object.keys(req.files).length === 0) {
    throw new MissingAttributesError('No file were uploaded')
  }

  // Check if source file for this uploadDate is already existed
  // TODO => Need to uncomment this when release
  // if(await hasSourceFileByDate(dataSourceDate)) {
  //   throw new MissingAttributesError("Not allow to replace file that is already uploaded")
  // }

  // Persist file to file systems
  const uploadFile = req.files.file
  const uploadedFilePath = await uploadExcelFile(dataSourceDate, uploadFile)

  // Create file record on DB
  const sourceFile = await insertSourceFile(dataSourceDate, uploadedFilePath, uploadFile.name)

  // Process uploaded Excel file
  await processSourceFile(sourceFile)

  res.status(200).json({ status: 'SUCCESS' })
}
