import _ from 'lodash'
import dayjs from 'dayjs'
import { Op } from 'sequelize'
import { Employee, EmployeeAttendance, Shift } from './definitions'
import { dateToString } from '../utils'

export const initDatabase = async () => {
  await Shift.sync({ alter: false })
  await Employee.sync({ alter: false })
  await EmployeeAttendance.sync({ alter: false })
}

export const findEmployees = async (activeInMonth) => {
  if(_.isDate(activeInMonth)) {
    return Employee.findAll({
      where: {
        terminationDate: {
          [Op.or]: {
            [Op.is]: null,
            [Op.gte]: dateToString(new Date(activeInMonth.getFullYear(), activeInMonth.getMonth(), 1)),
          }
        }
      }
    })
  }
  return Employee.findAll()
}

export const findEmployeeAttendances = async (attendanceMonth) => {
  const date = dayjs(attendanceMonth)
  const attendanceStart = date.startOf('month').toDate()
  const attendanceEnd = date.endOf('month').toDate()

  return EmployeeAttendance.findAll({
    where: {
      attendanceDate: {
        [Op.between]: [attendanceStart, attendanceEnd]
      }
    }
  })
}
