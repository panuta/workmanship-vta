import XLSX from 'xlsx'
import moment from 'moment'
import { isFunction, isInteger, range, zip, zipObject } from 'lodash'

/**
 * Parse cell containing time e.g. "31/10/2020 23:01" or "23:02"
 * @param str
 * @param fallbackValue
 * @return {string|null}
 */
export const parseTimeCell = (str, fallbackValue = null) => {
  try {
    const [, timeStr] = str.split(' ', 2)
    const [hourStr, minuteStr] = timeStr !== undefined ? timeStr.split(':', 2) : str.split(':', 2)

    const hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10)
    if(isInteger(hour) && isInteger(minute) && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${hourStr}:${minuteStr}`
    }
    return fallbackValue
  } catch (error) {
    return fallbackValue
  }
}

/**
 * Parse cell containing date
 * @param str
 * @param format
 * @param fallbackValue
 * @return {null|moment.Moment}
 */
export const parseDateTimeCell = (str, format, fallbackValue = null) => {
  const momentObject = moment.utc(str, format)
  if(momentObject.isValid()) {
    return momentObject
  }
  return fallbackValue
}

/**
 * Parse cell containing hours/minutes duration
 * @param text
 * @param delimiter
 * @param fallbackValue
 * @return {null|number}
 */
export const parseDurationCell = (text, delimiter, fallbackValue = null) => {
  let hoursText
  let minutesText
  if(delimiter === undefined) {
    if(text.indexOf('.') !== -1) {
      [hoursText, minutesText] = text.split('.')
    } else if(text.indexOf(':') !== -1) {
      [hoursText, minutesText] = text.split(':')
    } else {
      hoursText = "0"
      minutesText = text
    }
  } else {
    [hoursText, minutesText] = text.split(delimiter)
  }

  try {
    return parseInt(hoursText, 10) * 60 + parseInt(minutesText, 10)
  } catch (error) {
    return fallbackValue
  }
}

/**
 * Parse cell containing integer number
 * @param str
 * @param fallbackValue
 * @return {null|number}
 */
export const parseIntegerCell = (str, fallbackValue = null) => {
  try {
    const num = parseInt(str, 10)
    if(isInteger(num)) {
      return num
    }
  } catch (err) {
    return fallbackValue
  }
  return fallbackValue
}

export const readColumnData = (worksheet, cellRange, parser) => {
  const { s: { c: startCol, r: startRow }, e: { r: endRow } } = XLSX.utils.decode_range(cellRange)
  return range(startRow, endRow + 1)
    .map(row => {
      const cell = worksheet[XLSX.utils.encode_cell({ c: startCol, r: row })]
      if(cell === undefined || cell.v === undefined) return null

      if(isFunction(parser)) {
        return parser(cell)
      }
      return cell.v
    })
}

export const readColumnsData = (worksheet, columns) => {
  const data = columns.map(column => readColumnData(worksheet, column.range, column.parser))
  return zip(...data).map(datum => zipObject(columns.map(column => column.key), datum))
}

export const readCellValue = (worksheet, cellCode, defaultValue = '') => {
  const cell = worksheet[cellCode]
  if(cell === undefined || cell.v === undefined) {
    return defaultValue
  }
  return cell.v
}

export const generateColumnRange = (start, end) => {
  return range(XLSX.utils.decode_col(start), XLSX.utils.decode_col(end) + 1)
    .map(colIndex => XLSX.utils.encode_col(colIndex))
}
