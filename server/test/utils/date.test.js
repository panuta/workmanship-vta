import { timeMinutesDiff } from '../../src/utils/date'

describe('Date utilities', () => {

  describe('timeMinutesDiff function', () => {
    it('should return null when value is invalid', () => {
      expect(timeMinutesDiff('', '14:35')).toEqual(null)
      expect(timeMinutesDiff('8:00', '')).toEqual(null)
      expect(timeMinutesDiff('8:00', 'Not found')).toEqual(null)
    })

    it('should return time differences in minutes', () => {
      expect(timeMinutesDiff('8:00', '14:35')).toEqual(395)
      expect(timeMinutesDiff('23:00', '02:15')).toEqual(195)
    })
  })
})
