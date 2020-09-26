import { Employee, EmployeeAttendance, Shift, SourceFile } from '../data/models'

export const deleteEverything = async (req, res, next) => {
  await SourceFile.destroy({ truncate: true })
  await Shift.destroy({ truncate: true })
  await Employee.destroy({ truncate: true })
  await EmployeeAttendance.destroy({ truncate: true })

  res.status(200).json({
    status: 'OK'
  })
}
