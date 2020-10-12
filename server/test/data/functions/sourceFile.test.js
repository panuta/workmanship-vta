import Config from '../../../src/config'
import { initDatabase, dropDatabase, SourceFile } from '../../../src/data/models'
import { getLatestSourceFile } from '../../../src/functions/sourceFile'

jest.mock('../../../src/config')

describe('Employee functions', () => {
  beforeAll(async () => {
    Config.__mockConfig({
      databaseStorage: ':memory:',
      databaseTimestamps: false
    })
    await initDatabase()
  })

  afterAll(async () => {
    await dropDatabase()
  })

  beforeEach(async () => {
    jest.resetAllMocks()
    await SourceFile.destroy({ where: {} })
  })

  describe('getLatestSourceFile function', () => {
    it('should return latest SourceFile', async () => {
      const sourceFilesData = [{
        originalFilename: 'uploadFile1.xlsx',
        dataSourceDate: new Date(2020, 8, 2),
        filePath: '',
        uploadedDatetime: new Date(2020, 8, 2, 10, 0 , 0, 0)
        }, {
        originalFilename: 'uploadFile2.xlsx',
        dataSourceDate: new Date(2020, 8, 1),
        filePath: '',
        uploadedDatetime: new Date(2020, 8, 1, 10, 0 , 0, 0)
      }]
      await SourceFile.bulkCreate(sourceFilesData)

      const latestSourceFile = await getLatestSourceFile()

      expect(latestSourceFile.dataSourceDate).toEqual('2020-09-02')
    })

    it('should return null when no latest', async () => {
      const latestSourceFile = await getLatestSourceFile()

      expect(latestSourceFile).toEqual(null)
    })
  })
})
