import { createObjectCsvWriter } from 'csv-writer'

export const createCsvFile = async (filePath, headers, records) => {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: headers
  })

  return csvWriter.writeRecords(records)
}
