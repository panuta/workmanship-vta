import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Alert, Button, DatePicker, Table, Row, Col, Space, Layout } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import { useAsyncRun, useAsyncTaskFetch } from 'react-hooks-async'
import { useHistory, useLocation } from 'react-router-dom'

import { getAttendanceMonth, getAttendanceMonthString } from '../libs/attendanceMonth'

import './EmployeesAttendancesPage.scss'

const DecimalRenderer = (text, record, index) => {
  const className = text === 0 ? 'value-zero' : 'value-normal'
  return <span className={className}>{(Math.round(text * 100) / 100).toFixed(2)}</span>
}

const TABLE_COLUMN_WIDTH = 50
const TABLE_COLUMNS = [
  {
    title: 'พนักงาน', key: 'employee', fixed: 'left', width: 350,
    render: (text, record, index) => (
      <Space direction="vertical" size={2}>
        <div className="employee-title">{record.fullName}{ record.nickName && record.nickName !== '-' && <span> ( {record.nickName} )</span> }</div>
        <div className="employee-subtitle">รหัส: <span className="value">{record.code}</span> <span className="divider">|</span> ตำแหน่ง: <span className="value">{record.position}</span></div>
      </Space>
    )
  },
  { title: 'สถานะพนักงาน', dataIndex: 'status', key: 'status', align: 'center', width: 140 },
  { title: 'ใบเตือน', align: 'center', width: TABLE_COLUMN_WIDTH },
  { title: 'พักร้อน', dataIndex: 'vacation', align: 'center', width: TABLE_COLUMN_WIDTH },
  { title: 'ลาป่วย', dataIndex: 'sickLeave', align: 'center', width: TABLE_COLUMN_WIDTH },
  { title: 'ลากิจ', dataIndex: 'casualLeave', align: 'center', width: TABLE_COLUMN_WIDTH },
  { title: 'สะสม', dataIndex: 'compensation', align: 'right', width: TABLE_COLUMN_WIDTH, render: DecimalRenderer },
  { title: 'ใช้สะสม', dataIndex: 'usedCompensation', align: 'right', width: TABLE_COLUMN_WIDTH, render: DecimalRenderer },
  { title: (<span>สาย<br/>(นาที)</span>), dataIndex: 'minuteLate', align: 'right', width: TABLE_COLUMN_WIDTH, render: DecimalRenderer },
  { title: (<span>ออกก่อน<br/>(นาที)</span>), dataIndex: 'minuteEarlyLeave', align: 'right', width: TABLE_COLUMN_WIDTH, render: DecimalRenderer },
  { title: 'ขาด', dataIndex: 'noShow', align: 'center', width: TABLE_COLUMN_WIDTH },
  { title: 'เบี้ยขยัน', dataIndex: 'diligenceAllowance', align: 'center', width: TABLE_COLUMN_WIDTH },
]

const { Content } = Layout

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const EmployeesAttendancesPage = ({ dataUpdatedTimestamp }) => {
  // Extract query parameter
  const attendanceMonthParam = useQuery().get('month')

  // Attendance Month
  const [attendanceMonth, attendanceMonthPeriodStart, attendanceMonthPeriodEnd] = getAttendanceMonth(attendanceMonthParam)
  const attendanceMonthString = getAttendanceMonthString(attendanceMonth)

  // Fetch data
  const fetchUrl = `/api/employeesAttendances?month=${attendanceMonthString}${dataUpdatedTimestamp ? `&_updated=${dataUpdatedTimestamp}` : ''}`
  const fetchTask = useAsyncTaskFetch(fetchUrl)
  useAsyncRun(fetchTask)

  // DatePicker
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const handleOnClick = () => {
    if(datePickerOpen) setDatePickerOpen(false)
    else setDatePickerOpen(!datePickerOpen)
  }

  const history = useHistory()
  const handleMonthChange = (date, dateString) => {
    setDatePickerOpen(false)
    history.push(`/?month=${getAttendanceMonthString(date)}`)
  }

  const renderTableTitle = () => {
    return (
      <Row align="middle" className="table-title">
        <Col span={8} className="table-title-left">
          <Space>
            <Space direction="vertical" size={0} className="data-month">
              <div className="data-month-name">งวดเดือน {attendanceMonth.format('MMMM YYYY')}</div>
              <div className="data-month-period">{attendanceMonthPeriodStart.format('D MMMM YYYY')} - {attendanceMonthPeriodEnd.format('D MMMM YYYY')}</div>
            </Space>
            <Button onClick={handleOnClick} className="change-month-button"><CalendarOutlined /> เปลี่ยนงวด</Button>
            <div>
              <DatePicker
                picker="month"
                open={datePickerOpen}
                value={attendanceMonth}
                onChange={handleMonthChange} />
            </div>
          </Space>
        </Col>
        <Col span={16} className="table-title-right">
          <Space size={15}>
            {fetchTask.result &&
              <div className="data-latest-date">{fetchTask.result.latestDataSourceDate !== null ? `ข้อมูลล่าสุดถึงวันที่ ${moment(fetchTask.result.latestDataSourceDate, 'YYYY-MM-DD', true).format('D MMM YYYY')}` : 'ยังไม่มีข้อมูลเดือนนี้'}</div>
            }
          </Space>
        </Col>
      </Row>
    )
  }

  const renderErrorState = (errorMessage) => {
    return <Alert message='Error occurred while loading data' description={errorMessage} type='error' showIcon />
  }

  const renderLoadingState = () => {
    return <Table
      bordered
      loading
      columns={TABLE_COLUMNS}
      size="small"
      pagination={false}
      scroll={{x: "100%"}}
      className="attendances-table"
      title={renderTableTitle} />
  }

  const renderSuccessState = () => {
    return (
      <Table
        bordered
        columns={TABLE_COLUMNS}
        dataSource={fetchTask.result.employees}
        size="small"
        pagination={false}
        scroll={{x: "100%"}}
        className="attendances-table"
        title={renderTableTitle} />
    )
  }

  return (
    <Content className="employees-attendances-page">
      <div className="site-layout-content">
        {fetchTask.aborted && renderErrorState('Fetching aborted')}
        {fetchTask.error && renderErrorState(fetchTask.error)}
        {fetchTask.pending && renderLoadingState()}
        {fetchTask.result && renderSuccessState()}
      </div>
    </Content>
  )
}

export default EmployeesAttendancesPage
