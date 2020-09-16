import React from 'react'

export const apiStates = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
}

export const useApi = (url, effectDeps = []) => {
  const [data, setData] = React.useState({
    state: apiStates.LOADING,
    error: '',
    data: [],
  })

  const setPartData = (partialData) => setData({ ...data, ...partialData })

  React.useEffect(() => {
    console.log("fetch")
    setPartData({
      state: apiStates.LOADING,
    })
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPartData({
          state: apiStates.SUCCESS,
          data
        })
      })
      .catch(() => {
        setPartData({
          state: apiStates.ERROR,
          error: 'fetch failed'
        })
      })
  }, effectDeps)

  return data
}
