import _ from 'lodash'
import path from 'path'
import XLSX from 'xlsx'
import { v4 as uuidv4 } from 'uuid'
import { promises as fs } from 'fs'

import { USER_STORAGE_PATH } from '../../config/storage'

const TEMP_UPLOAD_PATH = `${USER_STORAGE_PATH}/sources/temp/`
const UPLOAD_PATH = `${USER_STORAGE_PATH}/sources/files/`

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

export const _generateUploadFilename = (dataSourceDate) => {
  if(_.isArray(dataSourceDate)) {
    return `VTA-${dataSourceDate[0].format('YYYY-MM-DD')}--${dataSourceDate[1].format('YYYY-MM-DD')}`
  }
  return `VTA-${dataSourceDate.format('YYYY-MM-DD')}`
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
    '2.schedule-ตารางกะ',
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
