import moment from 'moment'
import React, { useState } from 'react'
import { Alert, Button, DatePicker, Table, Row, Col, Space, Layout } from 'antd'
import { CloudUploadOutlined } from '@ant-design/icons'
import { useAsyncRun, useAsyncTask } from 'react-hooks-async'

import './EmployeeAttendancesPage.scss'

import UploadDrawer from '../components/UploadDrawer'

const NumberRenderer = (text, record, index) => (Math.round(text * 100) / 100).toFixed(2)

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
  { title: 'ลาป่วย', key: '', width: TABLE_COLUMN_WIDTH },
  { title: 'ลากิจ', key: '', width: TABLE_COLUMN_WIDTH },
  { title: (<span>ลากิจ<br/>(หักเงิน)</span>), key: '', width: TABLE_COLUMN_WIDTH },
  { title: 'สะสม', dataIndex: 'compensation', key: '', align: 'right', width: TABLE_COLUMN_WIDTH, render: NumberRenderer },
  { title: 'ใช้สะสม', dataIndex: 'usedCompensation', key: '', align: 'right', width: TABLE_COLUMN_WIDTH, render: NumberRenderer },
  { title: (<span>หนี้<br/>(สั่งหยุด)</span>), key: '', width: TABLE_COLUMN_WIDTH },
  { title: (<span>ใช้คืน<br/>(สั่งหยุด)</span>), key: '', width: TABLE_COLUMN_WIDTH },
  { title: (<span>สาย<br/>(นาที)</span>), key: '', width: TABLE_COLUMN_WIDTH },
  { title: (<span>ออกก่อน<br/>(นาที)</span>), key: '', width: TABLE_COLUMN_WIDTH },
  { title: 'ขาด', key: '', width: TABLE_COLUMN_WIDTH },
  { title: 'เบี้ยขยัน', key: '', width: TABLE_COLUMN_WIDTH },
]

const { Content } = Layout

const fetchEmployeeAttendances = async ({ signal }, month, year) => {
  const response = await fetch(`/api/employeeAttendances?month=${month}&year=${year}`, { signal })
  return response.json()
}

const EmployeeAttendancesPage = () => {
  const [monthYear, setMonthYear] = useState(moment().startOf('month'))
  const handleChange = (date, dateString) => {
    setMonthYear(date.startOf('month'))
  }

  const task = useAsyncTask(fetchEmployeeAttendances)
  useAsyncRun(task, monthYear.month() + 1, monthYear.year())

  // Upload Drawer
  const [uploadDrawerVisible, setUploadDrawerVisible] = useState(false)

  const handleUploadButtonClick = () => {
    setUploadDrawerVisible(true)
  }

  const handleUploadSuccess = (uploadedFile) => {
    setUploadDrawerVisible(false)
    task.start(monthYear.month() + 1, monthYear.year())  // Re-fetch data
  }
  const handleUploadFailure = () => {
    setUploadDrawerVisible(false)
  }
  const handleUploadCancel = () => {
    setUploadDrawerVisible(false)
  }

  const renderTableTitle = () => {
    return (
      <Row align="middle" className="table-title">
        <Col span={8} className="table-title-left">
          <DatePicker
            picker="month"
            size="large"
            format="MMMM YYYY"
            defaultValue={monthYear}
            onChange={handleChange} />
        </Col>
        <Col span={16} className="table-title-right">
          <Space size={15} className="title-datasource">
            {task.result && task.result.sourceFilename &&
            <Space direction="vertical" align="right" size={2}>
              <div className="datasource-file">ไฟล์ข้อมูล <a href="#" className="filename">{task.result.sourceFilename}</a></div>
              <div className="datasource-uploaded">อัพโหลดเมื่อวันที่ {moment(task.result.sourceUploadedDatetime).format('D MMM YYYY เวลา hh:mm')}</div>
            </Space>
            }
            <Button icon={<CloudUploadOutlined />} onClick={handleUploadButtonClick}>อัพโหลดไฟล์</Button>
          </Space>
        </Col>
      </Row>
    )
  }

  const renderErrorState = (error) => {
    return <Alert message='Error occurred while loading data' description={error} type='error' showIcon />
  }

  const renderLoadingState = () => {
    return <Table
      bordered
      loading
      columns={TABLE_COLUMNS}
      size="small"
      pagination={false}
      scroll={{x: "100%"}}
      className="time-attendance-table"
      title={renderTableTitle} />
  }

  const renderSuccessState = () => {
    return (
      <React.Fragment>
        <Table
          bordered
          columns={TABLE_COLUMNS}
          dataSource={task.result.employees}
          size="small"
          pagination={false}
          scroll={{x: "100%"}}
          className="time-attendance-table"
          title={renderTableTitle} />
        <UploadDrawer
          monthYear={monthYear}
          visible={uploadDrawerVisible}
          onSuccess={handleUploadSuccess}
          onFailure={handleUploadFailure}
          onCancel={handleUploadCancel}
        />
      </React.Fragment>
    )
  }

  return (
    <Content className="employee-attendances-page">
      <div className="site-layout-content">
        {task.error && renderErrorState(task.error)}
        {task.pending && renderLoadingState()}
        {task.result && renderSuccessState()}
      </div>
    </Content>
  )
}

export default EmployeeAttendancesPage
