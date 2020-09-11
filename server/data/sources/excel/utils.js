import _ from 'lodash'
import XLSX from 'xlsx'

export const readColumnData = (worksheet, range, parser) => {
  const { s: { c: startCol, r: startRow }, e: { r: endRow } } = XLSX.utils.decode_range(range)
  return _.range(startRow, endRow + 1)
    .map(row => {
      const cell = worksheet[XLSX.utils.encode_cell({ c: startCol, r: row })]
      if(cell === undefined || cell.v === undefined) return null

      if(_.isFunction(parser)) {
        return parser(cell)
      }
      return cell.v
    })
}

export const readColumnsData = (worksheet, columns) => {
  const data = columns.map(column => readColumnData(worksheet, column.range, column.parser))
  return _.zip(...data).map(datum => _.zipObject(columns.map(column => column.key), datum))
}

export const columnRange = (start, end) => {
  return _.range(XLSX.utils.decode_col(start), XLSX.utils.decode_col(end) + 1)
    .map(colIndex => XLSX.utils.encode_col(colIndex))
}
