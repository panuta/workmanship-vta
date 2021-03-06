// eslint-disable-next-line max-classes-per-file
import { Sequelize, DataTypes, Model } from 'sequelize'

import { config as appConfig } from '../config'

export class SourceFile extends Model {}
export class Shift extends Model {}
export class Employee extends Model {}
export class EmployeeAttendance extends Model {}

export let databaseConnection

export const initDatabase = async () => {
  databaseConnection = new Sequelize({
    dialect: 'sqlite',
    storage: appConfig.databaseStorage,
    logging: false
  })

  // Source File
  SourceFile.init({
    originalFilename: { type: DataTypes.STRING },
    dataSourceDate: { type: DataTypes.DATEONLY, unique: true },
    filePath: { type: DataTypes.STRING },
    uploadedDatetime: { type: DataTypes.DATE }
  }, {
    sequelize: databaseConnection,
    modelName: 'SourceFile',
    timestamps: appConfig.databaseTimestamps
  })

  await SourceFile.sync({ alter: false })

  // Shift
  Shift.init({
    code: { type: DataTypes.STRING, allowNull: false },
    start: { type: DataTypes.STRING },
    end: { type: DataTypes.STRING },
    break: { type: DataTypes.INTEGER }
  }, {
    sequelize: databaseConnection,
    modelName: 'Shift',
    timestamps: appConfig.databaseTimestamps
  })

  await Shift.sync({ alter: false })

  // Employee
  Employee.init({
    code: { type: DataTypes.STRING, allowNull: false },
    salutation: { type: DataTypes.STRING },
    fullName: { type: DataTypes.STRING, allowNull: false },
    nickName: { type: DataTypes.STRING },
    company: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    terminationDate: { type: DataTypes.DATEONLY }
  }, {
    sequelize: databaseConnection,
    modelName: 'Employee',
    timestamps: appConfig.databaseTimestamps
  })

  await Employee.sync({ alter: false })

  // Employee Attendance
  EmployeeAttendance.init({
    code: { type: DataTypes.STRING, allowNull: false, unique: 'compositeIndex' },
    attendanceDate: { type: DataTypes.DATEONLY, allowNull: false, unique: 'compositeIndex' },
    shift: { type: DataTypes.STRING },
    shiftIn: { type: DataTypes.STRING },
    shiftOut: { type: DataTypes.STRING },
    faceScanInOffice: { type: DataTypes.STRING },
    faceScanOutOffice: { type: DataTypes.STRING },
    faceScanInEntrance: { type: DataTypes.STRING },
    faceScanOutEntrance: { type: DataTypes.STRING },
    compensation: { type: DataTypes.DECIMAL, defaultValue: 0 },
    minutesLate: { type: DataTypes.DECIMAL, defaultValue: 0 },
    minutesEarlyLeave: { type: DataTypes.DECIMAL, defaultValue: 0 },
    overtime: { type: DataTypes.DECIMAL, defaultValue: 0 },
    notice: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    sequelize: databaseConnection,
    modelName: 'EmployeeAttendance',
    indexes: [{ unique: true, fields: ['code', 'attendanceDate'] }],
    timestamps: appConfig.databaseTimestamps
  })

  await EmployeeAttendance.sync({ alter: false })
}

export const closeDatabase = async () => {
  if(databaseConnection !== undefined) {
    await databaseConnection.close()
  }
}

export const dropDatabase = async () => {
  if(databaseConnection !== undefined) {
    await databaseConnection.drop()
  }
}
