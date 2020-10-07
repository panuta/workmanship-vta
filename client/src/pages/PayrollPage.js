import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { useAsyncRun, useAsyncTaskFetch } from 'react-hooks-async'
import { Alert, Layout, Space, Table } from 'antd'
import { DownloadOutlined, WarningOutlined } from '@ant-design/icons'

import { getAttendanceMonthPeriod, getAttendanceMonthString } from '../libs/attendanceMonth'

import './PayrollPage.scss'

const { Content } = Layout

const TABLE_COLUMNS = [
  { title: 'งวดเดือน', dataIndex: 'attendanceMonth', align: 'center', width: 240,
    render: (text, record, index) => {
      const [periodStart, periodEnd] = getAttendanceMonthPeriod(text)
      return (
        <Space direction="vertical" size={2}>
          <span className="data-month">{moment.utc(text).format('MMMM YYYY')}</span>
          <span className="data-month-period">{periodStart.format('D MMM YYYY')} - {periodEnd.format('D MMM YYYY')}</span>
        </Space>
      )
    }
  },
  { title: 'ดาวน์โหลดไฟล์', dataIndex: 'files', align: 'left',
    render: (text, record, index) => {
      const attendanceMonthString = getAttendanceMonthString(moment.utc(record.attendanceMonth))
      if(record.status === 'available' || record.status === 'incomplete') {
        return (
          <Space className="payroll-downloads">
            <Link className="ant-btn" to={`/download/payroll?file=attendance&month=${attendanceMonthString}`} target="_blank" download><DownloadOutlined /> ไฟล์ข้อมูลเวลาทำงาน</Link>
            <Link className="ant-btn" to={`/download/payroll?file=income&month=${attendanceMonthString}`} target="_blank" download><DownloadOutlined /> ไฟล์รายได้-เบี้ยเลี้ยง</Link>
            { record.status === 'incomplete' ? <span className="downloads-incomplete"><WarningOutlined /> ยังมีข้อมูลไม่ครบเดือน</span> : ''}
          </Space>
        )
      } else {
        return (
          <div className="downloads -unknown">ไม่มีไฟล์ข้อมูล</div>
        )
      }
    }
  }
]

function PayrollPage() {
  const fetchUrl = `/api/listPayrollFiles`
  const fetchTask = useAsyncTaskFetch(fetchUrl)
  useAsyncRun(fetchTask)

  const renderErrorState = (errorMessage) => {
    return <Alert message='Error occurred while loading data' description={errorMessage} type='error' showIcon />
  }

  const renderLoadingState = () => {
    return <Table
      bordered
      loading
      columns={TABLE_COLUMNS}
      pagination={false}
      scroll={{x: "100%"}}
      className="payroll-table"
    />
  }

  const renderSuccessState = () => {
    return (
      <Table
        bordered
        columns={TABLE_COLUMNS}
        dataSource={fetchTask.result.payrollFiles}
        pagination={false}
        scroll={{x: "100%"}}
        className="payroll-table"
      />
    )
  }

  return (
    <Content className="payroll-page">
      <div className="site-layout-content">
        {fetchTask.aborted && renderErrorState('Fetching aborted')}
        {fetchTask.error && renderErrorState(fetchTask.error)}
        {fetchTask.pending && renderLoadingState()}
        {fetchTask.result && renderSuccessState()}
      </div>
    </Content>
  )
}

export default PayrollPage
