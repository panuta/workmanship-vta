import _ from 'lodash'
import moment from 'moment'

export const getAttendanceMonth = (monthString) => {
  let currentDate
  if(monthString === undefined || monthString === null) {
    currentDate = moment.utc()
  } else {
    const [month, year] = monthString.split('-', 2)
    currentDate = moment.utc({ year, month: month - 1, day: 1 })
  }

  const _generate = (start, end) => {
    return [
      moment.utc({ year: end.year(), month: end.month(), day: 1 }),
      moment.utc({ year: start.year(), month: start.month(), day: 26 }),
      moment.utc({ year: end.year(), month: end.month(), day: 25 })
    ]
  }

  if(currentDate.date() >= 26) {
    const nextMonth = currentDate.clone().add(1, 'months')
    return _generate(currentDate, nextMonth)
  } else {
    const previousMonth = currentDate.clone().subtract(1, 'months')
    return _generate(previousMonth, currentDate)
  }
}

export const getAttendanceMonthString = (date) => {
  if(date.date() >= 26) {
    const nextMonth = date.clone().add(1, 'months')
    return `${_.padStart((nextMonth.month() + 1).toString(10), 2, '0')}-${nextMonth.year()}`
  } else {
    return `${_.padStart((date.month() + 1).toString(10), 2, '0')}-${date.year()}`
  }
}
