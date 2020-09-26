import _ from 'lodash'
import dayjs from 'dayjs'
import XLSX from 'xlsx'
import { generateColumnRange, parseInteger, readCellValue, readColumnsData } from './utils'
import { parseDuration } from '../../../utils/date'

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
    const START_ROW = 4
    const MAX_EMPLOYEE_ROWS = 200

    const worksheet = this.workbook.Sheets[this.workbook.SheetNames[0]]
    const columns = [
      { key: 'code', range: `B${START_ROW}:B${START_ROW + MAX_EMPLOYEE_ROWS}` },
      { key: 'salutation', range: `C${START_ROW}:C${START_ROW + MAX_EMPLOYEE_ROWS}` },
      { key: 'fullName', range: `D${START_ROW}:D${START_ROW + MAX_EMPLOYEE_ROWS}` },
      { key: 'nickName', range: `E${START_ROW}:E${START_ROW + MAX_EMPLOYEE_ROWS}` },
      { key: 'company', range: `F${START_ROW}:F${START_ROW + MAX_EMPLOYEE_ROWS}` },
      { key: 'status', range: `G${START_ROW}:G${START_ROW + MAX_EMPLOYEE_ROWS}` },
      { key: 'department', range: `H${START_ROW}:H${START_ROW + MAX_EMPLOYEE_ROWS}` },
      { key: 'position', range: `I${START_ROW}:I${START_ROW + MAX_EMPLOYEE_ROWS}` },
      { key: 'startDate', range: `J${START_ROW}:J${START_ROW + MAX_EMPLOYEE_ROWS}`, parser: cell => cell.w ? dayjs(cell.w, 'D/M/YY').toDate() : null },
      { key: 'terminationDate', range: `K${START_ROW}:K${START_ROW + MAX_EMPLOYEE_ROWS}`, parser: cell => cell.w ? dayjs(cell.w, 'D/M/YY').toDate() : null },
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
  readEmployeesShifts(fromDateNumber, toDateNumber) {
    const WORKSHEET_INDEX = 1  // 2.schedule-ตารางกะ
    const START_ROW = 5
    const MAX_EMPLOYEE_ROWS = 200
    const CODE_COLUMN = 'F'
    const SHIFT_START_COLUMN = 'L'
    const SHIFT_END_COLUMN = 'AP'

    const worksheet = this.workbook.Sheets[this.workbook.SheetNames[WORKSHEET_INDEX]]

    // Slicing for columns fromDay - toDay
    const columns = [ { key: 'code', range: `${CODE_COLUMN}${START_ROW}:${CODE_COLUMN}${START_ROW + MAX_EMPLOYEE_ROWS}` } ].concat(
      _.slice(generateColumnRange(SHIFT_START_COLUMN, SHIFT_END_COLUMN), fromDateNumber - 1, toDateNumber).map((col, i) => {
        return { key: `${fromDateNumber + i}`, range: `${col}${START_ROW}:${col}${START_ROW + MAX_EMPLOYEE_ROWS}` }
      })
    )

    const employeeShiftData = readColumnsData(worksheet, columns)
    return employeeShiftData.filter(employee => employee.code !== null)
  }

  readEmployeesInputDaily(fromDateNumber, toDateNumber) {
    const WORKSHEET_INDEX = 4  // 5.INPUT-Daily
    const MAX_EMPLOYEE_ROWS = 200
    const FIRST_DATE_CELL = XLSX.utils.decode_cell('J3')

    const worksheet = this.workbook.Sheets[this.workbook.SheetNames[WORKSHEET_INDEX]]

    // Find date cell column index for fromDay-toDay
    let checkingDateColumnIndex = FIRST_DATE_CELL.c
    const extractingDateColumnIndexes = []
    let consecutiveBlankCells = 0
    do {
      const dateCellValue = readCellValue(worksheet, XLSX.utils.encode_cell({ c: checkingDateColumnIndex, r: FIRST_DATE_CELL.r }))
      const dateCellNumValue = parseInteger(dateCellValue, null)
      if(dateCellNumValue !== null && dateCellNumValue >= fromDateNumber && dateCellNumValue <= toDateNumber) {
        extractingDateColumnIndexes.push(checkingDateColumnIndex)
        consecutiveBlankCells = 0
      } else {
        consecutiveBlankCells += 1
      }
      checkingDateColumnIndex += 1
    } while (consecutiveBlankCells < 30)

    // Map date cell column index to reading column range
    const extractingColumns = [
      { key: 'code', range: `B${FIRST_DATE_CELL.r + 3 + 1}:B${FIRST_DATE_CELL.r + 3 + MAX_EMPLOYEE_ROWS + 1}` }
    ]
    extractingDateColumnIndexes.forEach((columnIndex, i) => {
      let checkingColumnIndex = columnIndex
      do {
        const headerValue = readCellValue(worksheet, XLSX.utils.encode_cell({ c: checkingColumnIndex, r: FIRST_DATE_CELL.r + 1 }))
        const range = `${XLSX.utils.encode_cell({ c: checkingColumnIndex, r: FIRST_DATE_CELL.r + 3 })}:${XLSX.utils.encode_cell({ c: checkingColumnIndex, r: FIRST_DATE_CELL.r + 3 + MAX_EMPLOYEE_ROWS })}`

        if(headerValue === 'สาย') {
          extractingColumns.push({ key: `${fromDateNumber + i}.minutesLate`, range })
        } else if(headerValue === 'ออกก่อน') {
          extractingColumns.push({ key: `${fromDateNumber + i}.minutesEarlyLeft`, range })
        } else if(headerValue === 'OT') {
          extractingColumns.push({ key: `${fromDateNumber + i}.overtime`, range })
        } else if(headerValue === 'สะสม') {
          extractingColumns.push({ key: `${fromDateNumber + i}.compensation`, range })
        } else if(headerValue === 'ใบเตือน') {
          extractingColumns.push({ key: `${fromDateNumber + i}.notice`, range })
        } else if(headerValue === 'หมายเหตุ') {
          break
        }
        checkingColumnIndex += 1
        // eslint-disable-next-line no-constant-condition
      } while(true)
    })

    const employeeInputDailyData = readColumnsData(worksheet, extractingColumns)
    return employeeInputDailyData
      .filter(employee => employee.code !== null)
  }
}

export default ExcelReader
