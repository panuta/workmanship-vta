import _ from 'lodash'
import moment from 'moment'

import { InvalidRequestError, MissingAttributesError } from '../errors'

export const parseDateQueryParameter = (queryParameters, parameterName) => {
  const date = queryParameters[parameterName]
  if(date === undefined ) {
    throw new MissingAttributesError('Require "date" parameter')
  }

  const parsedDate = moment.utc(date, 'YYYY-MM-DD', true)
  if(!parsedDate.isValid()) {
    throw new InvalidRequestError('Date parameter is invalid')
  }

  return parsedDate
}

/**
 * Parse "month=MM-YYYY" from query parameter. MM is 1-indexed (January is 01)
 *
 * @param requestQuery: Object
 * @returns {moment.Moment}
 */
export const parseMonthYearQueryParameter = (requestQuery) => {
  const { month: monthYear } = requestQuery

  if(_.isNil(monthYear)) {
    throw new MissingAttributesError('Require "month" parameter')
  }

  const [month, year] = monthYear.split('-', 2)

  try {
    return moment.utc({
      year,
      month: parseInt(month, 10) - 1,
      day: 1
    }, true)
  } catch (error) {
    throw new InvalidRequestError('Month and year is invalid')
  }
}
