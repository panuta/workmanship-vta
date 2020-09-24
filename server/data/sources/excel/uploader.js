import _ from 'lodash'
import moment from 'moment'
import path from 'path'
import XLSX from 'xlsx'
import { v4 as uuidv4 } from 'uuid'
import { promises as fs } from 'fs'

const TEMP_UPLOAD_PATH = path.resolve(__dirname, '../../../resources/temp/')
const UPLOAD_PATH = path.resolve(__dirname, '../../../resources/')

export const _getFileExtension = (file) => {
  const filename = file.name
  return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename
}

export const _storeFileAtTemporaryLocation = async (file) => {
  // Create temp upload folder
  await fs.mkdir(TEMP_UPLOAD_PATH, { recursive: true })

  const filePath = path.resolve(TEMP_UPLOAD_PATH, `${uuidv4()}`)
  await fs.writeFile(filePath, file.data)

  return filePath
}

export const _generateUploadFilename = (uploadDate) => {
  return `VTA-${moment(uploadDate).format('YYYY-MM-DD')}`
}

export const uploadExcelFile = async (dataSourceDate, file) => {
  // Validate file extension
  if(_getFileExtension(file) !== 'xlsx') {
    throw Error('Upload file extension is not xlsx')
  }

  // Store file at temporary location
  const tempFilePath = await _storeFileAtTemporaryLocation(file)

  // Validate Excel file (checking if it contains desired worksheets)
  const excelWorkbook = XLSX.readFile(tempFilePath)

  if(_.intersection(excelWorkbook.SheetNames, [
    '1.Employee',
    '2.Schedule-ตารางกะ',
    '5.INPUT-Daily'
  ]).length !== 3) {
    throw Error('Upload file is missing some required worksheets')
  }

  // Create upload folder
  await fs.mkdir(UPLOAD_PATH, { recursive: true })

  // Rename temp file to real file
  const uploadedFilePath = path.resolve(UPLOAD_PATH, `${_generateUploadFilename(dataSourceDate)}.xlsx`)
  await fs.rename(tempFilePath, uploadedFilePath)

  return uploadedFilePath
}
