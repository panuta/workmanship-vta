import fs from 'fs'
import path from 'path'
import { isNil } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import { USER_STORAGE_PATH } from '../../config/storage'
import { createCsvFile } from '../../utils/csv'
import { calculateEmployeeAttendances } from '../attendance'
import { increaseByValueOnAttendanceMonth } from '../attendance/calculators'
import { sameAttendanceMonth } from '../../utils/attendanceMonth'
import { calculateHoursMinutes, timeMinutesDiff } from '../../utils/date'
import { effectiveLate, noShowAmount } from '../../bl'

const PAYROLL_FILE_TEMP_PATH = `${USER_STORAGE_PATH}/payroll/temp/`

const _generateTempFilePath = () => {
  fs.mkdirSync(PAYROLL_FILE_TEMP_PATH, { recursive: true })
  return path.resolve(PAYROLL_FILE_TEMP_PATH, `${uuidv4()}.csv`)
}

export const generateAttendancePayrollFile = async (attendanceMonth) => {
  const employeesAttendances = await calculateEmployeeAttendances(attendanceMonth, [
    {
      resultKey: 'workDay',
      fn: (attendance, currentValue, _attendanceMonth, shiftNames) => {
        // eslint-disable-next-line no-param-reassign
        if(isNil(currentValue)) currentValue = _attendanceMonth.daysInMonth()  // TODO => attendance month = Oct and daysInMonth = 31 but in reality have to be 30 days
        if(shiftNames.includes(attendance.shift) && sameAttendanceMonth(attendance.attendanceDate, _attendanceMonth)) {
          return currentValue - 1
        }
        return currentValue
      },
      args: [ ['OFF', 'ลาออก', 'HOLS'] ]
    }, {
      resultKey: 'lateMinute',
      fn: increaseByValueOnAttendanceMonth,
      args: [ 'minutesLate' ]
    }, {
      resultKey: 'earlyLeaveMinute',
      fn: increaseByValueOnAttendanceMonth,
      args: [ 'minutesEarlyLeave' ]
    }, {
      resultKey: 'noShowDay',
      fn: (attendance, currentValue, _attendanceMonth) => {
        // eslint-disable-next-line no-param-reassign
        if(isNil(currentValue)) currentValue = 0

        if(attendance.shift === 'ขาด' && sameAttendanceMonth(attendance.attendanceDate, _attendanceMonth)) {
          const shiftMinutes = timeMinutesDiff(attendance.shiftIn, attendance.shiftOut)
          const faceScanEntranceMinutes = timeMinutesDiff(attendance.faceScanInEntrance, attendance.faceScanOutEntrance)
          const faceScanOfficeMinutes = timeMinutesDiff(attendance.faceScanInOffice, attendance.faceScanOutOffice)

          if(faceScanOfficeMinutes === null || faceScanEntranceMinutes === null) {
            // No Show all day
            return currentValue + 1
          }

          if(!isNil(faceScanOfficeMinutes)) {
            return currentValue + noShowAmount(shiftMinutes, faceScanOfficeMinutes)
          }

          if(!isNil(faceScanEntranceMinutes)) {
            return currentValue + noShowAmount(shiftMinutes, faceScanEntranceMinutes)
          }
        }
        return currentValue
      },
      args: []
    }, {
      resultKey: 'ot2Hour',
      fn: increaseByValueOnAttendanceMonth,
      args: [ 'overtime' ]
    }
  ])

  const monthNumber = attendanceMonth.month() + 1

  const records = employeesAttendances.map(employeeAttendances => {
    const [lateHours, lateMinutes] = calculateHoursMinutes(effectiveLate(employeeAttendances.lateMinute))
    const [earlyLeaveHours, earlyLeaveMinutes] = calculateHoursMinutes(employeeAttendances.earlyLeaveMinute)

    return {
      code: employeeAttendances.employee.code,
      month: monthNumber,
      period: '1',
      workDay: employeeAttendances.workDay,
      workHour: 0,
      workMinute: 0,
      lateHour: lateHours,
      lateMinute: lateMinutes,
      lateBaht: 0,
      earlyLeaveHour: earlyLeaveHours,
      earlyLeaveMinute: earlyLeaveMinutes,
      earlyLeaveBaht: 0,
      noShowDay: employeeAttendances.noShowDay,
      noShowHour: 0,
      noShowMinute: 0,
      noShowBaht: 0,
      noPaidLeaveDay: 0,
      noPaidLeaveHour: 0,
      noPaidLeaveMinute: 0,
      periodPay: 0,
      mealPay: 0,
      ot1Hour: 0,
      ot1Minute: 0,
      ot1Baht: 0,
      ot2Hour: employeeAttendances.ot2Hour,
      ot2Minute: 0,
      ot2Baht: 0,
      ot3Hour: 0,
      ot3Minute: 0,
      ot3Baht: 0,
      ot4Hour: 0,
      ot4Minute: 0,
      ot4Baht: 0,
      column1: 0,
      _1: 0,
      _2: 0,
    }
  })

  const tempFilePath = _generateTempFilePath()

  const HEADERS = [
    { id: 'code', title: 'รหัสพนักงาน'},
    { id: 'month', title: 'เดือน'},
    { id: 'period', title: 'งวด'},
    { id: 'workDay', title: 'มาทำงาน(วัน)'},  // Calculated
    { id: 'workHour', title: 'มาทำงาน(ชม)'},
    { id: 'workMinute', title: 'มาทำงาน(นาที)'},
    { id: 'lateHour', title: 'มาสาย(ชม)'},  // Calculated
    { id: 'lateMinute', title: 'มาสาย(นาที)'},  // Calculated
    { id: 'lateBaht', title: 'มาสาย(บาท)'},
    { id: 'earlyLeaveHour', title: 'ออกก่อน(ชม)'},  // Calculated
    { id: 'earlyLeaveMinute', title: 'ออกก่อน(นาที)'},  // Calculated
    { id: 'earlyLeaveBaht', title: 'ออกก่อน(บาท)'},
    { id: 'noShowDay', title: 'ขาดงาน(วัน)'},  // Calculated
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
    { id: 'ot2Hour', title: 'โอที2(ชม)'},  // Calculated
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

  await createCsvFile(
    tempFilePath,
    HEADERS,
    records,
    true
  )

  return tempFilePath
}
