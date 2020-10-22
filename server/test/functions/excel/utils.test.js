import { parseDateTimeCell, parseTimeCell } from '../../../src/functions/excel/utils'

describe('Excel utilities', () => {

  describe('parseTimeCell function', () => {
    it('should return null when value is invalid', () => {
      expect(parseTimeCell('')).toEqual(null)
      expect(parseTimeCell('ไม่พบ')).toEqual(null)
      expect(parseTimeCell('Date Time')).toEqual(null)
      expect(parseTimeCell('Date 30:09')).toEqual(null)
      expect(parseTimeCell('10:67')).toEqual(null)
    })

    it('should return time when value is valid', () => {
      expect(parseTimeCell('31/10/2020 23:01')).toEqual('23:01')
      expect(parseTimeCell('23:02')).toEqual('23:02')
    })
  })

  describe('parseDateCell function', () => {
    it('should return null when value is invalid', () => {
      expect(parseDateTimeCell('', 'M/D/YY')).toEqual(null)
      expect(parseDateTimeCell('No Date', 'M/D/YY')).toEqual(null)
      expect(parseDateTimeCell('15:00', 'M/D/YY')).toEqual(null)

      expect(parseDateTimeCell('2020/01/05', 'M/D/YY')).toEqual(null)
    })

    it('should return date when value is invalid', () => {
      expect(parseDateTimeCell('12/20/20', 'M/D/YY').toDate()).toEqual(
        new Date(Date.UTC(2020, 11, 20)))

      expect(parseDateTimeCell('2020/12/01 14:06', 'YYYY/MM/DD HH:mm').toDate()).toEqual(
        new Date(Date.UTC(2020, 11, 1, 14, 6)))
    })
  })
})
