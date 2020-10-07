import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

import { createCsvFile } from '../../utils/csv'

const PAYROLL_FILE_TEMP_PATH = path.resolve(__dirname, '../../../resources/payroll/temp')

const _generateTempFilePath = () => {
  fs.mkdirSync(PAYROLL_FILE_TEMP_PATH, { recursive: true })
  return path.resolve(PAYROLL_FILE_TEMP_PATH, `${uuidv4()}.csv`)
}

export const generateAttendancePayrollFile = async (attendanceMonth) => {
  const HEADERS = [
    { id: 'code', title: 'รหัสพนักงาน'},
    { id: 'month', title: 'เดือน'},
    { id: 'period', title: 'งวด'},
  ]

  const monthNumber = attendanceMonth.month() + 1

  const records = [
    { code: '1001', month: monthNumber, period: '1' },
    { code: '1002', month: monthNumber, period: '1' },
    { code: '1003', month: monthNumber, period: '1' },
  ]

  const tempFilePath = _generateTempFilePath()

  await createCsvFile(
    tempFilePath,
    HEADERS,
    records
  )

  return tempFilePath
}

export const generateIncomePayrollFile = async (attendanceMonth) => {
  // TODO
}
