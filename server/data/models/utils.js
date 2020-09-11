
// TODO : bulkUpdate base on some key

export const parseDuration = (text) => {
  const [hoursText, minutesText] = text.split('.')
  try {
    return parseInt(hoursText, 10) * 60 + parseInt(minutesText, 10)
  } catch (error) {
    return null
  }
}
