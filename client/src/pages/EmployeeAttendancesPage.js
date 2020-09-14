import React from 'react'
import { DatePicker, Layout } from 'antd'

import TimeAttendanceTable from '../components/TimeAttendanceTable'

// import './EmployeeAttendancesPage.scss'

const { Content } = Layout

const EmployeeAttendancesPage = () => {
  return (
    <Content key="1" className="employee-attendances-page">
      <div className="site-layout-content">
        <div className="filters">
          <DatePicker picker="month" size="large" />
        </div>
        <TimeAttendanceTable />
      </div>
    </Content>
  )
}

export default EmployeeAttendancesPage
