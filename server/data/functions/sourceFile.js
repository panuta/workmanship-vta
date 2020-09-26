import { SourceFile } from '../models'

/**
 * Check if SourceFile for specified date existed
 */
export const hasSourceFileByDate = async (dataSourceDate) => {
  const sourceFile = await SourceFile.findOne({ where: { dataSourceDate } })
  return sourceFile !== null
}

/**
 * Create SourceFile instance
 */
export const insertSourceFile = async (dataSourceDate, uploadedFilePath, originalFilename) => {
  return SourceFile.create({
    originalFilename,
    dataSourceDate,
    filePath: uploadedFilePath,
    uploadedDatetime: new Date(),
  })
}

export const getLatestSourceFile = async () => {
  return SourceFile.max('dataSourceDate')
}
