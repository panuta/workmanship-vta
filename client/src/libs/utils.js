export const padZero = (str, size) => {
  while (str.length < (size || 2)) {
    str = "0" + str
  }
  return str
}
