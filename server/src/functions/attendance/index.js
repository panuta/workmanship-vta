import _ from 'lodash'
import { Op } from 'sequelize'
import { EmployeeAttendance } from '../../data/models'
import { getEmployees } from '../employee'
import { annualPeriod } from '../../utils/attendanceMonth'

export const getAnnualEmployeesAttendances = async (attendanceMonth, activeEmployeeCodes) => {
  const [startAnnualPeriod, endAnnualPeriod] = annualPeriod(attendanceMonth)

  const where = {
    attendanceDate: {
      [Op.between]: [startAnnualPeriod.toDate(), endAnnualPeriod.toDate()]
    }
  }
  if(activeEmployeeCodes) {
    where.code = activeEmployeeCodes
  }
  return EmployeeAttendance.findAll({ where })
}

/*
calculators = [
  {
    resultKey: 'notice',
    fn: increaseByValueAnnually,
    args: []
  }
]
 */
export const calculateEmployeeAttendances = async (attendanceMonth, calculators) => {
  const activeEmployees = await getEmployees(attendanceMonth)

  const activeEmployeeCodes = activeEmployees.map(employee => employee.code)
  const employeesAttendances = await getAnnualEmployeesAttendances(attendanceMonth, activeEmployeeCodes)

  // Convert list of employees to employee mapping
  const employeeMapping = activeEmployees.reduce((accumulator, employee) => {
    accumulator[employee.code] = { employee }
    return accumulator
  }, {})

  employeesAttendances.forEach(attendance => {
    const employeeCode = attendance.code
    calculators.forEach(calculator => {
      const currentValue = _.get(employeeMapping, [employeeCode, calculator.resultKey])

      const calculatorFunction = _.spread(calculator.fn)
      const result = calculatorFunction([attendance, currentValue, attendanceMonth, ...calculator.args])

      _.set(employeeMapping, [employeeCode, calculator.resultKey], result)
    })
  })
  return Object.values(employeeMapping)
}