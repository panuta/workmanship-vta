import path from 'path'
import ExcelReader from '../../../../../server/data/sources/excel/reader'

describe('ExcelReader', () => {
  const excelReader = new ExcelReader(path.resolve(__dirname, '../../../resources/input-template.xlsx'))

  // describe('readEmployeesShifts function', () => {
  //
  //   test('return single date', () => {
  //
  //   })
  // })

  describe('readEmployeesInputDaily', () => {
    excelReader.readEmployeesInputDaily(2, 3)
  })
})
