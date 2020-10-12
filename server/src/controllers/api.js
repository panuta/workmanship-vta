import _ from 'lodash'
import moment from 'moment'

import { config as appConfig } from '../config'
import { InvalidRequestError, MissingAttributesError } from '../errors'
import { Employee, EmployeeAttendance, Shift, SourceFile } from '../data/models'
import { calculateEmployeeAttendances } from '../functions/attendance'
import { getMonthlySourceFiles, hasSourceFileByDate, upsertSourceFile } from '../functions/sourceFile'
import { uploadExcelFile } from '../functions/excel/uploader'
import { processDailySourceFile, processMonthlySourceFile } from '../functions/excel/processors'
import { generatePayrollFiles } from '../functions/payroll'
import { attendanceMonthDates, findAttendanceMonth } from '../utils/attendanceMonth'
import { parseDateQueryParameter, parseMonthYearQueryParameter } from '../utils/queryParser'
import {
  increaseByValue,
  increaseByValueOnAttendanceMonth,
  increaseWhenShiftMatched
} from '../functions/attendance/calculators'

export const uploadDailyFile = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new MissingAttributesError('No file were uploaded')
  }

  const dataSourceDate = moment.utc().subtract(1, 'days').startOf('day')

  // Check if source file for this uploadDate is already existed
  if(!appConfig.allowReplaceDailyUpload && await hasSourceFileByDate(dataSourceDate)) {
    throw new MissingAttributesError("Not allow to replace file that is already uploaded")
  }

  // Persist file to file systems
  const uploadFile = req.files.file
  const uploadedFilePath = await uploadExcelFile(dataSourceDate, uploadFile)

  // Create file record on DB
  const [sourceFile, ] = await upsertSourceFile(dataSourceDate, uploadedFilePath, uploadFile.name)

  // TODO => Backup database before process

  // Process uploaded Excel file
  await processDailySourceFile(sourceFile)

  // Generate payroll files
  const attendanceMonth = findAttendanceMonth(dataSourceDate)
  await generatePayrollFiles(attendanceMonth)

  res.status(200).json({ status: 'SUCCESS' })
}

export const uploadMonthlyFile = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new MissingAttributesError('No file were uploaded')
  }

  const fromDate = parseDateQueryParameter(req.query, 'from')
  const toDate = parseDateQueryParameter(req.query, 'to')

  if(!fromDate.isSame(toDate, 'month')) {
    throw new InvalidRequestError('Dates must be in the same month')
  }

  // TODO : Check password

  // Persist file to file systems
  const uploadFile = req.files.file
  const uploadedFilePath = await uploadExcelFile([fromDate, toDate], uploadFile)

  // Create file record on DB
  const insertPromises = [];
  for (const d = fromDate.clone(); d.diff(toDate, 'days') <= 0; d.add(1, 'day')) {
    insertPromises.push(upsertSourceFile(d, uploadedFilePath, uploadFile.name))
  }
  const upsertResults = await Promise.all(insertPromises)

  // Process uploaded Excel file
  const [sourceFile, ] = upsertResults[0]
  await processMonthlySourceFile(sourceFile, fromDate, toDate)

  // Generate payroll files
  const fromAttendanceMonth = findAttendanceMonth(fromDate)
  const toAttendanceMonth = findAttendanceMonth(toDate)

  await generatePayrollFiles(fromAttendanceMonth)
  if(!fromAttendanceMonth.isSame(toAttendanceMonth, 'month')) {
    await generatePayrollFiles(toAttendanceMonth)
  }

  res.status(200).json({ status: 'SUCCESS' })
}


export const employeesAttendancesPage = async (req, res, next) => {
  const attendanceMonth = parseMonthYearQueryParameter(req.query)

  const employeesAttendances = await calculateEmployeeAttendances(attendanceMonth, [
    {
      resultKey: 'notice',
      fn: increaseByValue,
      args: [ 'notice' ]
    }, {
      resultKey: 'vacation',
      fn: increaseWhenShiftMatched,
      args: [ ['พักร้อน'] ]
    }, {
      resultKey: 'sickLeave',
      fn: increaseWhenShiftMatched,
      args: [ ['ลาป่วย'] ]
    }, {
      resultKey: 'casualLeave',
      fn: increaseWhenShiftMatched,
      args: [ ['ลากิจ'] ]
    }, {
      resultKey: 'compensation',
      fn: increaseByValue,
      args: [ 'compensation' ]
    }, {
      resultKey: 'minutesLate',
      fn: increaseByValueOnAttendanceMonth,
      args: [ 'minutesLate' ]
    }, {
      resultKey: 'minutesEarlyLeave',
      fn: increaseByValueOnAttendanceMonth,
      args: [ 'minutesEarlyLeave' ]
    }, {
      resultKey: 'noShow',
      fn: increaseWhenShiftMatched,
      args: [ ['ขาด'] ]
    }
  ])

  const employees = employeesAttendances.map(employeeAttendances => {
    const employeeDict = employeeAttendances.employee.toJSON()

    /**
     * Calculate Diligence Allowance (Monthly)
     * - No casualLeave
     * - No sickLeave
     * - No minutesLate
     * - No notice
     */
    const diligenceAllowance =
      employeeAttendances.casualLeave > 0 ||
      employeeAttendances.sickLeave > 0 ||
      employeeAttendances.minutesLate > 0 ||
      employeeAttendances.notice > 0
        ? -1 : 0

    return Object.assign(employeeDict, _.omit(employeeAttendances, ['employee']), {
      diligenceAllowance
    })
  })

  const sourceFiles = await getMonthlySourceFiles(attendanceMonth)
  const sourceDates = sourceFiles.map(sourceFile => sourceFile.dataSourceDate)

  res.status(200).json({
    sourceDates,
    employees
  })
}

export const listPayrollFiles = async (req, res, next) => {
  const START_ATTENDANCE_MONTH = moment.utc({ year: 2020, month: 7, day: 1 })
  const currentAttendanceMonth = findAttendanceMonth(moment.utc())

  const payrollFiles = []
  while(currentAttendanceMonth.isSameOrAfter(START_ATTENDANCE_MONTH)) {
    // eslint-disable-next-line no-await-in-loop
    const monthlySourceFiles = await getMonthlySourceFiles(currentAttendanceMonth)

    // Check if there're dates which has no SourceFile
    const noDataDates = _.difference(
      attendanceMonthDates(currentAttendanceMonth).map(date => date.format('YYYY-MM-DD')),
      monthlySourceFiles.map(sourceFile => sourceFile.dataSourceDate)
    )

    payrollFiles.push({
      attendanceMonth: currentAttendanceMonth.format('YYYY-MM-DD'),
      status: noDataDates.length === 0 ? 'available' : 'incomplete'
    })

    currentAttendanceMonth.subtract(1, 'months')
  }

  res.status(200).json({
    payrollFiles
  })
}

export const deleteEverything = async (req, res, next) => {
  await SourceFile.destroy({ truncate: true })
  await Shift.destroy({ truncate: true })
  await Employee.destroy({ truncate: true })
  await EmployeeAttendance.destroy({ truncate: true })

  res.status(200).json({
    status: 'OK'
  })
}

