import moment from 'moment'

import { InvalidRequestError, MissingAttributesError } from '../errors'

export const parseDateQueryParameter = (queryParameters, parameterName) => {
  const date = queryParameters[parameterName]
  if(date === undefined ) {
    throw new MissingAttributesError('Require "date" parameter')
  }

  const parsedDate = moment(date, 'YYYY-MM-DD', true)
  if(!parsedDate.isValid()) {
    throw new InvalidRequestError('Date parameter is invalid')
  }

  return parsedDate.toDate()
}

export const parseMonthYearQueryParameter = (requestQuery) => {
  const { month: monthYear } = requestQuery
  if(monthYear === undefined) {
    throw new MissingAttributesError('Require "month" parameter')
  }

  const [month, year] = monthYear.split('-', 2)

  try {
    return moment({ year, month, day: 1 }).toDate()
  } catch (error) {
    throw new InvalidRequestError('Month and year is invalid')
  }
}
