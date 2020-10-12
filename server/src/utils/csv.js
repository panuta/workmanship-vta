import fs from 'fs'
import { createObjectCsvWriter } from 'csv-writer'

/**
 * Prepend BOM character to make Excel encoding works correctly. See https://stackoverflow.com/a/42466254
 * @param filePath: String
 */
const prependBOMToFile = (filePath) => {
  const content = fs.readFileSync(filePath)
  fs.writeFileSync(filePath, `\ufeff${content}`)
}

export const createCsvFile = async (filePath, headers, records, prependBOM = false) => {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: headers
  })

  await csvWriter.writeRecords(records)
  if(prependBOM) {
    prependBOMToFile(filePath)
  }
}
