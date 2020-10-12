import { Op } from 'sequelize'
import { SourceFile } from '../data/models'
import { monthPeriod } from '../utils/attendanceMonth'

/**
 * Check if SourceFile with specific date exists
 *
 * @param dataSourceDate: Date
 * @return {Promise<boolean>}
 */
export const hasSourceFileByDate = async (dataSourceDate) => {
  const sourceFile = await SourceFile.findOne({ where: { dataSourceDate } })
  return sourceFile !== null
}

/**
 * Create a new SourceFile
 *
 * @param dataSourceDate: Date
 * @param uploadedFilePath: String
 * @param originalFilename: String
 * @return {Promise<SourceFile>}
 */
export const insertSourceFile = async (dataSourceDate, uploadedFilePath, originalFilename) => {
  return SourceFile.create({
    originalFilename,
    dataSourceDate,
    filePath: uploadedFilePath,
    uploadedDatetime: new Date(),
  })
}

/**
 * Create or update SourceFile
 *
 * @param dataSourceDate: Date
 * @param uploadedFilePath: String
 * @param originalFilename: String
 * @return {Promise<[SourceFile, (boolean | null)]>}
 */
export const upsertSourceFile = async (dataSourceDate, uploadedFilePath, originalFilename) => {
  return SourceFile.upsert({
    originalFilename,
    dataSourceDate,
    filePath: uploadedFilePath,
    uploadedDatetime: new Date(),
  })
}

/**
 * Get SourceFile with latest source date
 *
 * @return {Promise<SourceFile | null>}
 */
export const getLatestSourceFile = async () => {
  return SourceFile.findOne({
    order: [
      ['dataSourceDate', 'DESC']
    ]
  })
}

/**
 * Get all SourceFile within a month
 *
 * @param attendanceMonth: Moment object
 * @return {Promise<SourceFile[]>}
 */
export const getMonthlySourceFiles = async (attendanceMonth) => {
  const [startPeriod, endPeriod] = monthPeriod(attendanceMonth)
  return SourceFile.findAll({
    where: {
      dataSourceDate: {
        [Op.between]: [startPeriod.toDate(), endPeriod.toDate()]
      }
    },
    order: [
      ['dataSourceDate', 'ASC']
    ]
  })
}
