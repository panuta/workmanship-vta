import dayjs from 'dayjs'
import path from 'path'
import { promises as fs } from 'fs'
import { SourceFile } from '../../models/definitions'

const UPLOAD_PATH = path.resolve(__dirname, '../../../resources/')

export const generateUploadFilename = (monthYear, uploadedDatetime) => {
  return `VTA-${dayjs(monthYear).format('MM-YYYY')}-${Math.floor(uploadedDatetime.getTime() / 1000)}`
}

export const uploadExcelFile = async (monthYear, file) => {
  // Validate file uploaded

  // Create upload folder
  fs.mkdirSync(UPLOAD_PATH, { recursive: true })

  // Generate Filename
  const uploadedDatetime = new Date()
  const filename = generateUploadFilename(monthYear, uploadedDatetime)
  const filePath = path.resolve(UPLOAD_PATH, `${filename}.xlsx`)

  await fs.writeFile(filePath, file.data)

  return SourceFile.create({
    originalFilename: file.name,
    monthYear,
    filePath,
    uploadedDatetime,
  })
}
