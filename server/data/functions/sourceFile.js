import { Op } from 'sequelize'
import { SourceFile } from '../models'
import { monthPeriod } from '../../utils/attendanceMonth'

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

export const upsertSourceFile = async (dataSourceDate, uploadedFilePath, originalFilename) => {
  return SourceFile.upsert({
    originalFilename,
    dataSourceDate,
    filePath: uploadedFilePath,
    uploadedDatetime: new Date(),
  })
}

export const getLatestSourceFile = async () => {
  return SourceFile.findOne({
    order: [
      ['dataSourceDate', 'DESC']
    ]
  })
}

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
