import { isNaN, isNumber, isString, parseInt } from 'lodash'

export const parseInteger = (value, defaultValue = 0) => {
  if(isNumber(value)) {
    return value
  }

  if(isString(value)) {
    const parsedValue = parseInt(value)
    if(!isNaN(parsedValue)) {
      return parsedValue
    }
  }

  return defaultValue
}