import path from 'path'
import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize({ dialect: 'sqlite', storage: path.resolve(__dirname, '../../database.sqlite') })

export const SourceFile = sequelize.define('SourceFile', {
  sourceId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4 },
  originalFilename: { type: DataTypes.STRING },
  monthYear: { type: DataTypes.DATEONLY },
  filePath: { type: DataTypes.STRING },
  uploadedDatetime: { type: DataTypes.DATE },
  isSelected: { type: DataTypes.BOOLEAN, defaultValue: false }
})

export const Shift = sequelize.define('Shift', {
  code: { type: DataTypes.STRING, allowNull: false },
  start: { type: DataTypes.STRING },
  end: { type: DataTypes.STRING },
  break: { type: DataTypes.INTEGER }
})

export const Employee = sequelize.define('Employee', {
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
})

export const EmployeeAttendance = sequelize.define('EmployeeAttendance', {
  code: { type: DataTypes.STRING, allowNull: false, unique: 'compositeIndex' },
  attendanceDate: { type: DataTypes.DATEONLY, allowNull: false, unique: 'compositeIndex' },
  shift: { type: DataTypes.STRING },
  compensation: { type: DataTypes.DECIMAL },
  usedCompensation: { type: DataTypes.DECIMAL },
  forceBreak: { type: DataTypes.DECIMAL },
  returnedForceBreak: { type: DataTypes.DECIMAL },
  minuteLate: { type: DataTypes.DECIMAL },
  minuteEarlyLeave: { type: DataTypes.DECIMAL },
  noShow: { type: DataTypes.DECIMAL },
  diligenceAllowance: { type: DataTypes.DECIMAL },
}, {
  indexes: [{ unique: true, fields: ['code', 'attendanceDate'] }]
})
