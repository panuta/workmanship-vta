import React from 'react'
import moment from 'moment'

import './UploadDates.scss'

const UploadDates = ({attendanceMonth, sourceDates}) => {
  const startPeriod = attendanceMonth.clone().subtract(1, 'months').date(26)
  const endPeriod = attendanceMonth.clone().date(25)

  const today = moment.utc()

  if(sourceDates === undefined || sourceDates === null) {
    sourceDates = []
  }

  const dates = []
  let checkingDate = startPeriod
  while(!checkingDate.isAfter(endPeriod)) {
    let className
    if(sourceDates.includes(checkingDate.format('YYYY-MM-DD'))) {
      className = 'has-data'
    } else {
      if(checkingDate.isSameOrAfter(today)) {
        className = 'not-applicable'
      } else {
        className = 'no-data'
      }
    }
    dates.push({ date: checkingDate.date(), className })
    checkingDate = checkingDate.add(1, 'days')
  }

  return (
    <div className="upload-dates-component">{dates.map(date => <div className={`date ${date.className}`}>{date.date}</div>)}</div>
  )
}

export default UploadDates
