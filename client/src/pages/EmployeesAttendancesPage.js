import moment from 'moment'
import React, { useState } from 'react'
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
  { title: 'รหัสพนักงาน', dataIndex: 'code', align: 'center', width: 60 },
  {
    title: 'พนักงาน', key: 'employee', fixed: 'left', width: 350,
    render: (text, record, index) => (
      <Space direction="vertical" size={2}>
        <div className="employee-title">{record.fullName}{ record.nickName && record.nickName !== '-' && <span> ( {record.nickName} )</span> }</div>
        <div className="employee-subtitle">ฝ่าย/แผนก: <span className="value">{record.department}</span> <span className="divider">|</span> ตำแหน่ง: <span className="value">{record.position}</span></div>
      </Space>
    )
  },
  { title: 'สถานะพนักงาน', dataIndex: 'status', align: 'center', width: 100 },
  { title: (<div>ใบเตือน<span>(ครั้ง)</span></div>), dataIndex: 'notice', align: 'center', width: TABLE_COLUMN_WIDTH },
  { title: (<div>พักร้อน<span>(วัน)</span></div>), dataIndex: 'vacation', align: 'center', width: TABLE_COLUMN_WIDTH },
  { title: (<div>ลาป่วย<span>(วัน)</span></div>), dataIndex: 'sickLeave', align: 'center', width: TABLE_COLUMN_WIDTH },
  { title: (<div>ลากิจ<span>(วัน)</span></div>), dataIndex: 'casualLeave', align: 'center', width: TABLE_COLUMN_WIDTH },
  { title: (<div>สะสม<span>(วัน)</span></div>), dataIndex: 'compensation', align: 'right', width: TABLE_COLUMN_WIDTH, render: DecimalRenderer },
  { title: (<div>สาย<span>(นาที)</span></div>), dataIndex: 'minutesLate', align: 'right', width: TABLE_COLUMN_WIDTH, render: DecimalRenderer },
  { title: (<div>ออกก่อน<span>(นาที)</span></div>), dataIndex: 'minutesEarlyLeave', align: 'right', width: TABLE_COLUMN_WIDTH, render: DecimalRenderer },
  { title: (<div>ขาด<span>(ครั้ง)</span></div>), dataIndex: 'noShow', align: 'center', width: TABLE_COLUMN_WIDTH },
  { title: 'เบี้ยขยัน', dataIndex: 'diligenceAllowance', align: 'center', width: TABLE_COLUMN_WIDTH, render: (text, record, index) => {
    if(record.diligenceAllowance === 0) {
      return (<span className="qualified">ได้</span>)
    } else {
      return (<span className="disqualified">ไม่ได้</span>)
    }
  } },
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

  console.log(fetchTask.result && fetchTask.result.latestDataSourceDate)

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
              <div className="data-latest-date">{fetchTask.result.latestDataSourceDate !== null ? `ข้อมูลล่าสุดถึงวันที่ ${moment(fetchTask.result.latestDataSourceDate, 'YYYY-MM-DD', true).format('D MMM YYYY')}` : 'ยังไม่มีข้อมูล'}</div>
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
