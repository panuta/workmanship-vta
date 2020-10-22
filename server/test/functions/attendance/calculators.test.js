import {
  increaseByValue,
  increaseByValueOnAttendanceMonth,
  increaseWhenShiftMatched,
  increaseWhenShiftMatchedOnAttendanceMonth,
  increaseWhenShiftNotMatchedOnAttendanceMonth
} from '../../../src/functions/attendance/calculators'
import { toAttendanceMonth } from '../../../src/utils/attendanceMonth'
import { utcDate } from '../../../src/utils/date'

describe('Attendance calculators', () => {
  describe('increaseByValue function', () => {
    it('should increase by value', () => {
      const attendanceMonth = toAttendanceMonth(2020, 8)
      const attendances = [
        { leave: 1, sick: 0 },
        { leave: 2, sick: 1 },
        { leave: 0, sick: 0 },
        { leave: '3', sick: 0 },
        { leave: 'N/A', sick: 0 },
      ]

      let result = null
      attendances.forEach(attendance => {
        result = increaseByValue(attendance, result, attendanceMonth, 'leave')
      })

      expect(result).toEqual(6)
    })
  })

  describe('increaseByValueOnAttendanceMonth function', () => {
    it('should increase by value', () => {
      const attendanceMonth = toAttendanceMonth(2020, 8)
      const attendances = [
        { attendanceDate: utcDate(2020, 7, 25), leave: 1, sick: 0 },
        { attendanceDate: utcDate(2020, 7, 26), leave: 1, sick: 0 },
        { attendanceDate: utcDate(2020, 8, 1), leave: 1, sick: 0 },
        { attendanceDate: utcDate(2020, 8, 25), leave: 1, sick: 0 },
        { attendanceDate: utcDate(2020, 8, 26), leave: 1, sick: 1 },
      ]

      let result = null
      attendances.forEach(attendance => {
        result = increaseByValueOnAttendanceMonth(attendance, result, attendanceMonth, 'leave')
      })

      expect(result).toEqual(3)
    })
  })

  describe('increaseWhenShiftMatched function', () => {
    it('should increase value', () => {
      const attendanceMonth = toAttendanceMonth(2020, 8)
      const attendances = [
        { shift: 'A' },
        { shift: 'B' },
        { shift: 'C' },
        { shift: 'A' },
        { },
      ]

      let result = null
      attendances.forEach(attendance => {
        result = increaseWhenShiftMatched(attendance, result, attendanceMonth, ['A', 'B'])
      })

      expect(result).toEqual(3)
    })
  })

  describe('increaseWhenShiftMatchedOnAttendanceMonth function', () => {
    it('should increase value', () => {
      const attendanceMonth = toAttendanceMonth(2020, 8)
      const attendances = [
        { attendanceDate: utcDate(2020, 7, 25), shift: 'A' },
        { attendanceDate: utcDate(2020, 7, 26), shift: 'A' },
        { attendanceDate: utcDate(2020, 8, 1), shift: 'B' },
        { attendanceDate: utcDate(2020, 8, 2), shift: 'C' },
        { attendanceDate: utcDate(2020, 8, 25), shift: 'A' },
        { attendanceDate: utcDate(2020, 8, 26), shift: 'A' },
      ]

      let result = null
      attendances.forEach(attendance => {
        result = increaseWhenShiftMatchedOnAttendanceMonth(attendance, result, attendanceMonth, ['A', 'B'])
      })

      expect(result).toEqual(3)
    })
  })

  describe('increaseWhenShiftNotMatchedOnAttendanceMonth function', () => {
    it('should increase value', () => {
      const attendanceMonth = toAttendanceMonth(2020, 8)
      const attendances = [
        { attendanceDate: utcDate(2020, 7, 25), shift: 'A' },
        { attendanceDate: utcDate(2020, 7, 26), shift: 'A' },
        { attendanceDate: utcDate(2020, 8, 1), shift: 'B' },
        { attendanceDate: utcDate(2020, 8, 2), shift: 'D' },
        { attendanceDate: utcDate(2020, 8, 3), shift: 'C' },
        { attendanceDate: utcDate(2020, 8, 25), shift: 'A' },
        { attendanceDate: utcDate(2020, 8, 26), shift: 'A' },
      ]

      let result = null
      attendances.forEach(attendance => {
        result = increaseWhenShiftNotMatchedOnAttendanceMonth(attendance, result, attendanceMonth, ['A', 'B'])
      })

      expect(result).toEqual(2)
    })
  })
})
