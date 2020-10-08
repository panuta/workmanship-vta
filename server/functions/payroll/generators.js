import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

import { createCsvFile } from '../../utils/csv'
import { getMonthlyEmployeesAttendances } from '../employeeAttendance'

const PAYROLL_FILE_TEMP_PATH = path.resolve(__dirname, '../../resources/payroll/temp')

const _generateTempFilePath = () => {
  fs.mkdirSync(PAYROLL_FILE_TEMP_PATH, { recursive: true })
  return path.resolve(PAYROLL_FILE_TEMP_PATH, `${uuidv4()}.csv`)
}

export const generateAttendancePayrollFile = async (attendanceMonth) => {
  const HEADERS = [
    { id: 'code', title: 'รหัสพนักงาน'},
    { id: 'month', title: 'เดือน'},
    { id: 'period', title: 'งวด'},
    { id: 'workDay', title: 'มาทำงาน(วัน)'},
    { id: 'workHour', title: 'มาทำงาน(ชม)'},
    { id: 'workMinute', title: 'มาทำงาน(นาที)'},
    { id: 'lateHour', title: 'มาสาย(ชม)'},
    { id: 'lateMinute', title: 'มาสาย(นาที)'},
    { id: 'lateBaht', title: 'มาสาย(บาท)'},
    { id: 'earlyLeaveHour', title: 'ออกก่อน(ชม)'},
    { id: 'earlyLeaveMinute', title: 'ออกก่อน(นาที)'},
    { id: 'earlyLeaveBaht', title: 'ออกก่อน(บาท)'},
    { id: 'noShowDay', title: 'ขาดงาน(วัน)'},
    { id: 'noShowHour', title: 'ขาดงาน(ชม)'},
    { id: 'noShowMinute', title: 'ขาดงาน(นาที)'},
    { id: 'noShowBaht', title: 'ขาดงาน(บาท)'},
    { id: 'noPaidLeaveDay', title: 'ลาหักเงิน(วัน)'},
    { id: 'noPaidLeaveHour', title: 'ลาหักเงิน(ชม)'},
    { id: 'noPaidLeaveMinute', title: 'ลาหักเงิน(นาที)'},
    { id: 'periodPay', title: 'ค่ากะ'},
    { id: 'mealPay', title: 'ค่าอาหาร'},
    { id: 'ot1Hour', title: 'โอที1(ชม)'},
    { id: 'ot1Minute', title: 'โอที1(นาที)'},
    { id: 'ot1Baht', title: 'โอที1(บาท)'},
    { id: 'ot2Hour', title: 'โอที2(ชม)'},
    { id: 'ot2Minute', title: 'โอที2(นาที)'},
    { id: 'ot2Baht', title: 'โอที2(บาท)'},
    { id: 'ot3Hour', title: 'โอที3(ชม)'},
    { id: 'ot3Minute', title: 'โอที3(นาที)'},
    { id: 'ot3Baht', title: 'โอที3(บาท)'},
    { id: 'ot4Hour', title: 'โอที4(ชม)'},
    { id: 'ot4Minute', title: 'โอที4(นาที)'},
    { id: 'ot4Baht', title: 'โอที4(บาท)'},
    { id: 'column1', title: 'Column1'},
    { id: '_1', title: '_1'},
    { id: '_2', title: '_2'},
  ]

  const employeesAttendances = await getMonthlyEmployeesAttendances(attendanceMonth)

  const monthNumber = attendanceMonth.month() + 1

  const records = employeesAttendances.map(employeeAttendances => {
    // Work Day
    // workDay
    /*
    OFF
ขาด
ลาออก
ลากิจ
ลาป่วย
พักร้อน
ใช้สะสม
HOLS
     */

    return { code: employeeAttendances.code, month: monthNumber, period: '1' }
  })

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
