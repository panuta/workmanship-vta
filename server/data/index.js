import { findEmployeeAttendances, findEmployees } from './models'

export const getMonthlyEmployeeAttendances = async (attendanceMonth) => {
  const employees = await findEmployees(attendanceMonth)
  const employeeAttendances = await findEmployeeAttendances(attendanceMonth)

  const employeeMapping = employees.reduce((accumulator, employee) => {
    accumulator[employee.code] = {
      employee,
      vacation: 0
    }
    return accumulator
  }, {})

  employeeAttendances.forEach(employeeAttendance => {
    // Vacation
    if(employeeAttendance.shift === 'พักร้อน') {
      employeeMapping[employeeAttendance.code].vacation += 1
    }


  })

  const result = Object.values(employeeMapping).map(employeeData => {
    const employeeDict = employeeData.employee.toJSON()
    // console.log(employeeDict)
    return Object.assign(employeeDict, {
      vacation: employeeData.vacation
    })
  })

  // console.log(result)
  return result
}
