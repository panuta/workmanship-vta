import { Op } from 'sequelize'
import { Employee } from '../models'
import { dateToString, monthPeriod } from '../utils'

export const findEmployees = async (attendanceMonth) => {
  if(attendanceMonth !== undefined) {
    /**
     * Active employee
     * ( startDate is before end of month period )
     * AND
     * ( ( terminationDate is null ) OR ( terminationDate is after start of period ) )
     */
    const [startPeriod, endPeriod] = monthPeriod(attendanceMonth.year(), attendanceMonth.month())
    const startPeriodString = dateToString(startPeriod)
    const endPeriodString = dateToString(endPeriod)
    return Employee.findAll({
      where: {
        [Op.and]: [
          { startDate: {
            [Op.lte]: endPeriodString } },
          { terminationDate: {
            [Op.or]: [
              { [Op.is]: null },
              { [Op.gte]: startPeriodString },
            ] } },
        ]
      }
    })
  }
  return Employee.findAll()
}
