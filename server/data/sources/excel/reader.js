import dayjs from 'dayjs'
import XLSX from 'xlsx'
import { columnRange, readColumnsData } from './utils'
import { parseDuration } from '../../models/utils'

class ExcelReader {
  constructor(filePath) {
    // this.workbook = XLSX.readFile(filePath, { cellDates: true })  // TODO : Remove cellDates and switch to column data type as params
    this.workbook = XLSX.readFile(filePath)
  }

  static _columnDefinition(columns, startRow, endRow) {
    return [
      columns.map(source => `${source.col}${startRow}:${source.col}${endRow}`),
      columns.map(source => source.key)
    ]
  }

  readShifts() {
    const worksheet = this.workbook.Sheets[this.workbook.SheetNames[1]]
    const columns = [
      { key: 'code', range: 'A4:A65' },
      { key: 'start', range: 'B4:B65', parser: cell => cell.w },
      { key: 'end', range: 'C4:C65', parser: cell => cell.w },
      { key: 'break', range: 'D4:D65', parser: cell => parseDuration(cell.w) },
    ]

    const shiftData = readColumnsData(worksheet, columns)
    return shiftData
      .filter(employee => employee.code !== null)
  }

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

  readEmployeeShifts() {
    const worksheet = this.workbook.Sheets[this.workbook.SheetNames[1]]
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
}

export default ExcelReader
