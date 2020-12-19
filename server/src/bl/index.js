
export const noShowAmount = (shiftMinutes, showMinutes) => {
  const halfDay = shiftMinutes / 2
  const halfDayRange = [halfDay - halfDay * 0.25, halfDay + halfDay * 0.25]

  if(showMinutes < halfDayRange[0]) return 1
  if(showMinutes > halfDayRange[1]) return 0
  return 0.5
}

export const effectiveLate = (lateMinutes) => {
  // TODO
  return lateMinutes
  // if(lateMinutes <= 5) {
  //   return 0
  // } else {
  //   return lateMinutes - 5
  // }
}
