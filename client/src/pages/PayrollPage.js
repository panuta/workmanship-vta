import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Layout, Space, Table } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import { getAttendanceMonthPeriod } from '../libs/attendanceMonth'

import './PayrollPage.scss'
import { useAsyncRun, useAsyncTaskFetch } from 'react-hooks-async'

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
    render: (text, record, index) => (
      <Space className="downloads -available">
        <Link className="ant-btn" to="/download?file=attendance&month=" target="_blank" download><DownloadOutlined /> ไฟล์ข้อมูลเวลาทำงาน</Link>
      </Space>
    )
  }
]

const RESULT = [
  { attendanceMonth: '2020-10-01', status: 'available', files: { payroll: 'file1', another: 'file2' } },
  { attendanceMonth: '2020-09-01', status: 'incomplete', files: { payroll: 'file1', another: 'file2' } },
]

function PayrollPage() {
  const fetchUrl = `/api/listPayrollFiles`
  const fetchTask = useAsyncTaskFetch(fetchUrl)
  useAsyncRun(fetchTask)

  return (
    <Content className="payroll-page">
      <div className="site-layout-content">
        <Table
          bordered
          columns={TABLE_COLUMNS}
          dataSource={RESULT}
          pagination={false}
          scroll={{x: "100%"}}
          className="payroll-table"
        />
      </div>
    </Content>
  )
}

export default PayrollPage
