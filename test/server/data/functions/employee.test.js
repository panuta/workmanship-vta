import moment from 'moment'

import Config from '../../../../server/config'
import { initDatabase, dropDatabase, Employee } from '../../../../server/data/models'
import { findEmployees } from '../../../../server/data/functions/employee'

jest.mock('../../../../server/config')

describe('Employee functions', () => {
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
    await Employee.destroy({ where: {} })
  })

  const initEmployeesTables = async () => {
    const employeesData = [{
      code: '0001', fullName: 'Employee1',
      company: 'SE', status: '', department: '',
      startDate: new Date(2020, 1, 1),
      terminationDate: new Date(2020, 3, 30)
    }, {
      code: '0002', fullName: 'Employee2',
      company: 'SE', status: '', department: '',
      startDate: new Date(2020, 1, 1),
      terminationDate: new Date(2020, 8, 30)
    }, {
      code: '0003', fullName: 'Employee3',
      company: 'SE', status: '', department: '',
      startDate: new Date(2020, 0, 1),
      terminationDate: null
    }, {
      code: '0004', fullName: 'Employee4',
      company: 'SE', status: '', department: '',
      startDate: new Date(2020, 9, 1),
      terminationDate: null
    }]
    await Employee.bulkCreate(employeesData)
  }

  describe('findEmployees function', () => {
    it('should return all employees', async () => {
      await initEmployeesTables()
      await expect(findEmployees()).resolves.toMatchSnapshot()
    })

    it('should return active employees', async () => {
      await initEmployeesTables()
      await expect(findEmployees(moment({ year: 2020, month: 8 }))).resolves.toMatchSnapshot()
    })
  })
})
