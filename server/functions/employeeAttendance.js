


// export const getMonthlyEmployeesAttendances = async (attendanceMonth) => {
//   const activeEmployees = await getEmployees(attendanceMonth)
//
//   const activeEmployeeCodes = activeEmployees.map(employee => employee.code)
//   const employeesAttendances = await getAnnualEmployeesAttendances(attendanceMonth, activeEmployeeCodes)
//
//   // Convert list of employees to employee mapping
//   const employeeMapping = activeEmployees.reduce((accumulator, employee) => {
//     accumulator[employee.code] = {
//       employee,
//       notice: 0,
//       vacation: 0,
//       sickLeave: 0,
//       casualLeave: 0,
//       compensation: 0,
//       minutesLate: 0,
//       minutesEarlyLeave: 0,
//       noShow: 0,
//       diligenceAllowance: 0,
//     }
//     return accumulator
//   }, {})
//
//   employeesAttendances.forEach(employeeAttendance => {
//     // Only for employees that is valid within this month
//     if(_.has(employeeMapping, [employeeAttendance.code])) {
//       const annualIncreaseWhenShiftIs = (shiftName, valueName) => {
//         if(employeeAttendance.shift === shiftName) {
//           employeeMapping[employeeAttendance.code][valueName] += 1
//         }
//       }
//
//       const annualIncreaseByValue = (valueName) => {
//         if(_.isNumber(employeeAttendance[valueName])) {
//
//           employeeMapping[employeeAttendance.code][valueName] += employeeAttendance[valueName]
//         }
//       }
//
//       const monthlyIncreaseByValue = (valueName) => {
//         if(_.isNumber(employeeAttendance[valueName]) && sameAttendanceMonth(employeeAttendance.attendanceDate, attendanceMonth)) {
//           employeeMapping[employeeAttendance.code][valueName] += employeeAttendance[valueName]
//         }
//       }
//
//       // Notice (Annual)
//       annualIncreaseByValue('notice')
//
//       // Vacation (Annual)
//       annualIncreaseWhenShiftIs('พักร้อน', 'vacation')
//
//       // Sick Leave (Annual)
//       annualIncreaseWhenShiftIs('ลาป่วย', 'sickLeave')
//
//       // Casual Leave (Annual)
//       annualIncreaseWhenShiftIs('ลากิจ', 'casualLeave')
//
//       // Compensation (Annual)
//       annualIncreaseByValue('compensation')
//
//       // Minutes Late (Monthly)
//       monthlyIncreaseByValue('minutesLate')
//
//       // Minutes Early Leave (Monthly)
//       monthlyIncreaseByValue('minutesEarlyLeave')
//
//       // No Show (Annual)
//       annualIncreaseWhenShiftIs('ขาด', 'noShow')
//     }
//   })
//
//   return Object.values(employeeMapping).map(employeeData => {
//     const employeeDict = employeeData.employee.toJSON()
//
//     /**
//      * Calculate Diligence Allowance (Monthly)
//      * - No casualLeave
//      * - No sickLeave
//      * - No minutesLate
//      * - No notice
//      */
//     const diligenceAllowance =
//       employeeData.casualLeave > 0 ||
//       employeeData.sickLeave > 0 ||
//       employeeData.minutesLate > 0 ||
//       employeeData.notice > 0
//         ? -1 : 0
//
//     return Object.assign(employeeDict, _.omit(employeeData, ['employee']), {
//       diligenceAllowance
//     })
//   })
// }
