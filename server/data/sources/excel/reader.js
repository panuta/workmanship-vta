import dayjs from 'dayjs'
import XLSX from 'xlsx'
import { columnRange, readCellValue, readColumnsData } from './utils'
import { parseDuration } from '../../utils'

class ExcelReader {
  constructor(filePath) {
    this.workbook = XLSX.readFile(filePath)
  }

  /**
   * Returns all possible shifts in a company
   * @returns [ { code, start, end, break } ]
   */
  readShifts() {
    const worksheet = this.workbook.Sheets[this.workbook.SheetNames[1]]
    const columns = [
      { key: 'code', range: 'A5:A65' },
      { key: 'start', range: 'B5:B65', parser: cell => cell.w },
      { key: 'end', range: 'C5:C65', parser: cell => cell.w },
      { key: 'break', range: 'D5:D65', parser: cell => parseDuration(cell.w) },
    ]

    const shiftData = readColumnsData(worksheet, columns)
    return shiftData
      .filter(shift => shift.code !== null)
  }

  /**
   * Returns a list of employees
   * @returns [ { code, salutation, fullName, nickName, company ... } ]
   */
  readEmployees() {
    const worksheet = this.workbook.Sheets[this.workbook.SheetNames[0]]
    const columns = [
      { key: 'code', range: 'B107:B256' },
      { key: 'salutation', range: 'C107:C256' },
      { key: 'fullName', range: 'D107:D256' },
      { key: 'nickName', range: 'E107:E256' },
      { key: 'company', range: 'F107:F256' },
      { key: 'status', range: 'G107:G256' },
      { key: 'department', range: 'H107:H256' },
      { key: 'position', range: 'I107:I256' },
      { key: 'startDate', range: 'J107:J256', parser: cell => cell.w ? dayjs(cell.w, 'D/M/YY').toDate() : null },
      { key: 'terminationDate', range: 'K107:K256', parser: cell => cell.w ? dayjs(cell.w, 'D/M/YY').toDate() : null },
    ]

    const employeeData = readColumnsData(worksheet, columns)
    return employeeData
      .filter(employee => employee.code !== null)
      .map(employee => Object.assign(employee, { code: `${employee.code}` }))
  }

  /**
   * Returns employees' attendant shift or vacation separated by dates
   * Data source mainly from "2.schedule-ตารางกะ" worksheet
   * @returns [ { employee: { code, salutation, fullName ... }, 1, 2, 3, 4 } ]
   */
  readEmployeesShifts() {
    const worksheet = this.workbook.Sheets[this.workbook.SheetNames[1]]  // 2.schedule-ตารางกะ
    const columns = [
      { key: 'code', range: 'I5:I120' },
    ].concat(
      columnRange('O', 'AS').map((col, i) => {
        return { key: `${i + 1}`, range: `${col}5:${col}120` }
      })
    )

    const employeeShiftData = readColumnsData(worksheet, columns)
    return employeeShiftData
      .filter(employee => employee.code !== null)
  }

  readEmployeesInputDaily() {
    const WORKSHEET_INDEX = 4  // 5.INPUT-Daily
    const MAX_EMPLOYEE_ROWS = 200
    const START_DATE_CELL = XLSX.utils.decode_cell('J3')
    const LAST_COLUMN_NAME_OF_A_DAY = 'เบี้ยขยัน'

    const worksheet = this.workbook.Sheets[this.workbook.SheetNames[WORKSHEET_INDEX]]

    let checkingColumn = START_DATE_CELL.c

    const extractingColumns = [
      { key: 'code', range: `B${START_DATE_CELL.r + 3 + 1}:B${START_DATE_CELL.r + 3 + MAX_EMPLOYEE_ROWS + 1}` },
    ]

    let blankDateCells = 0
    do {
      const dateCellValue = readCellValue(worksheet, XLSX.utils.encode_cell({ c: checkingColumn, r: START_DATE_CELL.r }))

      // If cell has date value, start reading values within the date
      if(dateCellValue) {
        let inStatsColumns = false
        do {
          const topHeaderValue = readCellValue(worksheet, XLSX.utils.encode_cell({ c: checkingColumn, r: START_DATE_CELL.r + 1 }))
          const bottomHeaderValue = readCellValue(worksheet, XLSX.utils.encode_cell({ c: checkingColumn, r: START_DATE_CELL.r + 2 }))

          // Start collecting columns when topHeaderValue is 'สถิติการใช้สิทธิ์ประจำวัน'
          if(!inStatsColumns) {
            inStatsColumns = topHeaderValue === 'สถิติการใช้สิทธิ์ประจำวัน'
          }

          if(inStatsColumns && bottomHeaderValue !== '') {
            const range = `${XLSX.utils.encode_cell({ c: checkingColumn, r: START_DATE_CELL.r + 3 })}:${XLSX.utils.encode_cell({ c: checkingColumn, r: START_DATE_CELL.r + 3 + MAX_EMPLOYEE_ROWS })}`
            if(bottomHeaderValue === 'สะสม') {
              extractingColumns.push({ key: `${dateCellValue}.compensation`, range })
            } else if(bottomHeaderValue === 'ใช้สะสม') {
              extractingColumns.push({ key: `${dateCellValue}.usedCompensation`, range })
            } else if(bottomHeaderValue === 'หนี้สั่งหยุด') {
              extractingColumns.push({ key: `${dateCellValue}.forceBreak`, range })
            } else if(bottomHeaderValue === 'ใช้คืน(สั่งหยุด)') {
              extractingColumns.push({ key: `${dateCellValue}.returnedForceBreak`, range })
            } else if(bottomHeaderValue === 'สาย(นาที)') {
              extractingColumns.push({ key: `${dateCellValue}.minuteLate`, range })
            } else if(bottomHeaderValue === 'ออกก่อน(นาที)') {
              extractingColumns.push({ key: `${dateCellValue}.minuteEarlyLeave`, range })
            } else if(bottomHeaderValue === 'ขาด') {
              extractingColumns.push({ key: `${dateCellValue}.noShow`, range })
            } else if(bottomHeaderValue === 'เบี้ยขยัน') {
              extractingColumns.push({ key: `${dateCellValue}.diligenceAllowance`, range })
            }
            // => ADD MORE HERE <=

            // Stop collecting columns within a date when LAST_COLUMN_NAME_OF_A_DAY found
            if(bottomHeaderValue === LAST_COLUMN_NAME_OF_A_DAY) {
              break
            }
          }

          checkingColumn += 1

          // eslint-disable-next-line no-constant-condition
        } while(true)

        blankDateCells = 0
      } else {
        blankDateCells += 1
      }

      // Stop collecting columns when no date found within 5 consecutive cells
      if(blankDateCells > 5) {
        break
      }

      checkingColumn += 1

      // eslint-disable-next-line no-constant-condition
    } while (true)

    const employeeInputDailyData = readColumnsData(worksheet, extractingColumns)
    return employeeInputDailyData
      .filter(employee => employee.code !== null)
  }
}

export default ExcelReader

/*
ใบเตือน	พักร้อน	ลาป่วย	ลากิจ	ลากิจหักเงิน	สะสม	ใช้สะสม	หนี้ (สั่งหยุด)	ใช้คืน(สั่งหยุด)	สาย(นาที)	ออกก่อน(นาที)	ขาด	เบี้ยขยัน
- vacation
- sickLeave
- casualLeave
- unpaidLeave
- compensation
- usedCompensation
- forceBreak
- returnedForceBreak
- minuteLate
- minuteEarlyLeave
- noShow
- diligenceAllowance
*/
