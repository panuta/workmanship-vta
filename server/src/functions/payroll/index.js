import _ from 'lodash'
import fs from 'fs'
import path from 'path'

import { USER_STORAGE_PATH } from '../../config/storage'
import { generateAttendancePayrollFile, generateIncomePayrollFile } from './generators'

export const PAYROLL_FILE_STORAGE_PATH = `${USER_STORAGE_PATH}/payroll/files/`

export const VALID_FILE_TYPES = [
  'attendance',
  'income'
]

/**
 * Get file path and file name for payroll file by convention
 *
 * @param attendanceMonth: Moment object
 * @param fileType: String
 * @return {string} => File path and name
 * @private
 */
const _getPayrollFilePath = (attendanceMonth, fileType) => {
  return path.resolve(PAYROLL_FILE_STORAGE_PATH, `payroll-${attendanceMonth.format('YYYY-MM')}-${fileType}.csv`)
}

/**
 * Move and rename temp file to real payroll file
 *
 * @param tempFilePath: String
 * @param attendanceMonth: Moment object
 * @param fileType: String
 * @private
 */
const _swapTempFileToPayrollFile = (tempFilePath, attendanceMonth, fileType) => {
  const payrollFilePath = _getPayrollFilePath(attendanceMonth, fileType)
  fs.mkdirSync(PAYROLL_FILE_STORAGE_PATH, { recursive: true })
  fs.renameSync(tempFilePath, payrollFilePath)
}

/**
 * Validate and clean file type. Return cleaned file type back. If file type not valid, return null
 *
 * @param fileType: String
 * @return {string|null}
 */
export const sanitizeFileType = (fileType) => {
  if(_.isNil(fileType) || !_.isString(fileType)) return null

  const cleanFileType = fileType.toLowerCase()
  if(VALID_FILE_TYPES.includes(cleanFileType)) {
    return cleanFileType
  }
  return null
}

export const generatePayrollFiles = async (attendanceMonth) => {
  // Generate attendance file
  const tempAttendancePayrollFilePath = await generateAttendancePayrollFile(attendanceMonth)
  _swapTempFileToPayrollFile(tempAttendancePayrollFilePath, attendanceMonth, 'attendance')

  // Generate income file
  // const tempIncomePayrollFilePath = await generateIncomePayrollFile(attendanceMonth)
  // _swapTempFileToPayrollFile(tempIncomePayrollFilePath, attendanceMonth, 'income')
}

/**
 * Get payroll file by file type and attendance month. If no file existed, generate a new one
 *
 * @param attendanceMonth: Moment object
 * @param fileType: String
 * @return {Promise<string>}
 */
export const getOrCreatePayrollFile = async (attendanceMonth, fileType) => {
  const payrollFilePath = _getPayrollFilePath(attendanceMonth, fileType)
  if(!fs.existsSync(payrollFilePath)) {
    await generatePayrollFiles(attendanceMonth)
  }
  return payrollFilePath
}
