import Config from '../../../../server/config'
import { initDatabase, EmployeeAttendance, closeDatabase, Employee } from '../../../../server/data/models'
import {
  getAnnualEmployeesAttendances,
  getMonthlyEmployeesAttendances
} from '../../../../server/data/functions/employeeAttendance'
import { getEmployees } from '../../../../server/data/functions/employee'
import { toMomentObject } from '../../../../server/utils/date'

jest.mock('../../../../server/config')
jest.mock('../../../../server/data/functions/employee')

describe('Employee Attendance functions', () => {
  beforeAll(async () => {
    Config.__mockConfig({
      databaseStorage: ':memory:',
      databaseTimestamps: false
    })
    await initDatabase()
  })

  afterEach(async () => {
    jest.resetAllMocks()
    await EmployeeAttendance.destroy({ where: {} })
  })

  describe('getAnnualEmployeesAttendances function', () => {
    it('should return attendances within a year for active employees', async () => {
      await EmployeeAttendance.bulkCreate([
        { code: '1001', attendanceDate: new Date(2019, 11, 25), shift: 'A' },
        { code: '1001', attendanceDate: new Date(2019, 11, 26), shift: 'A' },
        { code: '1001', attendanceDate: new Date(2020, 0, 25), shift: 'A' },
        { code: '1001', attendanceDate: new Date(2020, 0, 26), shift: 'A' },
        { code: '1001', attendanceDate: new Date(2020, 11, 25), shift: 'A' },
        { code: '1001', attendanceDate: new Date(2020, 11, 26), shift: 'A' },
        { code: '1002', attendanceDate: new Date(2020, 0, 25), shift: 'A' },
        { code: '1002', attendanceDate: new Date(2020, 0, 26), shift: 'A' },
        { code: '1003', attendanceDate: new Date(2020, 0, 25), shift: 'A' },
        { code: '1003', attendanceDate: new Date(2020, 0, 26), shift: 'A' },
      ])

      const attendanceMonth = toMomentObject(new Date(2020, 8, 1))
      await expect(getAnnualEmployeesAttendances(attendanceMonth, ['1001', '1003'])).resolves.toMatchSnapshot()
    })
  })

  describe('getMonthlyEmployeesAttendances function',  () => {
    beforeEach(() => {
      getEmployees.mockResolvedValue([
        Employee.build({ code: '1001' }),
        Employee.build({ code: '1002' }),
        Employee.build({ code: '1003' })
      ])
    })

    it('should return correct values', async () => {
      await EmployeeAttendance.bulkCreate([
        { code: '1001', attendanceDate: new Date(2019, 11, 25),
          shift: 'พักร้อน', notice: 1, compensation: 1, minutesLate: 10, minutesEarlyLeave: 20 },
        { code: '1001', attendanceDate: new Date(2019, 11, 26),
          shift: 'A', notice: 1, compensation: 0, minutesLate: 5, minutesEarlyLeave: 3 },
        { code: '1001', attendanceDate: new Date(2019, 11, 27),
          shift: 'ลากิจ', notice: 0, compensation: 0, minutesLate: 0, minutesEarlyLeave: 0 },
        { code: '1001', attendanceDate: new Date(2019, 11, 28),
          shift: 'ลาป่วย', notice: 0, compensation: 0, minutesLate: 0, minutesEarlyLeave: 0 },
        { code: '1001', attendanceDate: new Date(2019, 11, 29),
          shift: 'A', notice: 0, compensation: 1, minutesLate: 3, minutesEarlyLeave: 2 },
        { code: '1001', attendanceDate: new Date(2020, 0, 1),
          shift: 'พักร้อน', notice: 0, compensation: 0, minutesLate: 0, minutesEarlyLeave: 0 },
        { code: '1001', attendanceDate: new Date(2020, 0, 2),
          shift: 'ขาด', notice: 0, compensation: 0, minutesLate: 0, minutesEarlyLeave: 9 },
        { code: '1001', attendanceDate: new Date(2020, 8, 3),
          shift: 'ลาป่วย', notice: 0, compensation: 1, minutesLate: 5, minutesEarlyLeave: 7 },
        { code: '1001', attendanceDate: new Date(2020, 11, 25),
          shift: 'A', notice: 1, compensation: 0, minutesLate: 7, minutesEarlyLeave: 0 },
        { code: '1001', attendanceDate: new Date(2020, 11, 26),
          shift: 'ลากิจ', notice: 1, compensation: 1, minutesLate: 10, minutesEarlyLeave: 5 },

        { code: '1002', attendanceDate: new Date(2019, 11, 25),
          shift: 'พักร้อน', notice: 1, compensation: 1, minutesLate: 9, minutesEarlyLeave: 20 },
        { code: '1002', attendanceDate: new Date(2019, 11, 26),
          shift: 'A', notice: 0, compensation: 0, minutesLate: 0, minutesEarlyLeave: 0 },
        { code: '1002', attendanceDate: new Date(2019, 11, 27),
          shift: 'ลากิจ', notice: 0, compensation: 0, minutesLate: 0, minutesEarlyLeave: 0 },
        { code: '1002', attendanceDate: new Date(2019, 11, 28),
          shift: 'ลาป่วย', notice: 0, compensation: 0, minutesLate: 0, minutesEarlyLeave: 0 },
        { code: '1002', attendanceDate: new Date(2019, 11, 29),
          shift: 'A', notice: 0, compensation: 1, minutesLate: 3, minutesEarlyLeave: 0 },
        { code: '1002', attendanceDate: new Date(2020, 0, 1),
          shift: 'A', notice: 0, compensation: 0, minutesLate: 0, minutesEarlyLeave: 0 },
        { code: '1002', attendanceDate: new Date(2020, 0, 2),
          shift: 'A', notice: 0, compensation: 0, minutesLate: 10, minutesEarlyLeave: 4 },
        { code: '1002', attendanceDate: new Date(2020, 8, 3),
          shift: 'ลาป่วย', notice: 0, compensation: 1, minutesLate: 0, minutesEarlyLeave: 0 },
        { code: '1002', attendanceDate: new Date(2020, 11, 25),
          shift: 'A', notice: 0, compensation: 0, minutesLate: 0, minutesEarlyLeave: 0 },
        { code: '1002', attendanceDate: new Date(2020, 11, 26),
          shift: 'ลากิจ', notice: 1, compensation: 1, minutesLate: 10, minutesEarlyLeave: 5 },
      ])

      const attendanceMonth = toMomentObject(new Date(Date.UTC(2020, 8, 1)))
      const values = await getMonthlyEmployeesAttendances(attendanceMonth)

      expect(values.map(employee => [
        employee.code,
        employee.notice,
        employee.vacation,
        employee.sickLeave,
        employee.casualLeave,
        employee.compensation,
        employee.minutesLate,
        employee.minutesEarlyLeave,
        employee.noShow
      ])).toEqual([
        ['1001', 2, 1, 2, 1, 2, 5, 7, 1],
        ['1002', 0, 0, 2, 1, 2, 0, 0, 0],
        ['1003', 0, 0, 0, 0, 0, 0, 0, 0],
      ])
    })

  })

  afterAll(async () => {
    await closeDatabase()
  })
})
