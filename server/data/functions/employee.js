import { Op } from 'sequelize'
import { Employee } from '../models'
import { monthPeriod } from '../../utils/attendanceMonth'
import { dateToString } from '../../utils/date'

export const getEmployees = async (attendanceMonth) => {
  if(attendanceMonth !== undefined) {
    /**
     * Active employee
     * ( startDate is before end of month period )
     * AND
     * ( ( terminationDate is null ) OR ( terminationDate is after start of period ) )
     */
    const [startPeriod, endPeriod] = monthPeriod(attendanceMonth)
    return Employee.findAll({
      where: {
        [Op.and]: [
          { startDate: {
            [Op.lte]: dateToString(endPeriod) } },
          { terminationDate: {
            [Op.or]: [
              { [Op.is]: null },
              { [Op.gte]: dateToString(startPeriod) },
            ] } },
        ]
      }
    })
  }
  return Employee.findAll()
}
