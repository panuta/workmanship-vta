let config = {
  test: 'Sometest'
}

const __mockConfig = overriddenConfig => {
  config = overriddenConfig
}

export const initConfig = () => jest.fn()
export { config }
export default {
  __mockConfig
}
