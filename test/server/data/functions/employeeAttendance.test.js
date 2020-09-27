import Config from '../../../../server/config'
import { initDatabase, dropDatabase, EmployeeAttendance } from '../../../../server/data/models'
import { getAnnualEmployeesAttendances } from '../../../../server/data/functions/employeeAttendance'
import { toMomentObject } from '../../../../server/utils/date'

jest.mock('../../../../server/config')

describe('Employee Attendance functions', () => {
  beforeAll(async () => {
    Config.__mockConfig({
      databaseStorage: ':memory:',
      databaseTimestamps: false
    })
    await initDatabase()
  })

  afterAll(async () => {
    await dropDatabase()
  })

  beforeEach(async () => {
    jest.resetAllMocks()
    await EmployeeAttendance.destroy({ where: {} })
  })

  /*
  code: { type: DataTypes.STRING, allowNull: false, unique: 'compositeIndex' },
  attendanceDate: { type: DataTypes.DATEONLY, allowNull: false, unique: 'compositeIndex' },
  shift: { type: DataTypes.STRING },
  compensation: { type: DataTypes.DECIMAL },
  minutesLate: { type: DataTypes.DECIMAL },
  minutesEarlyLeave: { type: DataTypes.DECIMAL },
  overtime: { type: DataTypes.DECIMAL },
  notice: { type: DataTypes.INTEGER }
   */

  // const initEmployeeAttendanceTable = async () => {
  //   const employeesAttendancesData = [
  //     { code: '1001', attendanceDate: new Date(2019, 12, 25), shift: 'A', compensation: 0, minutesLate: 0, minutesEarlyLeave: 0, overtime: 0, notice: 0 },
  //     { code: '1001', attendanceDate: new Date(2019, 12, 26), shift: 'A', compensation: 0, minutesLate: 0, minutesEarlyLeave: 0, overtime: 0, notice: 0 },
  //   ]
  //   await EmployeeAttendance.bulkCreate(employeesAttendancesData)
  // }

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


})
