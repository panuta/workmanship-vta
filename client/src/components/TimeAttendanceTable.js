import React from 'react'
import { Alert, Button, Table, Row, Col, Space } from 'antd'
import { CloudUploadOutlined } from '@ant-design/icons'

import { apiStates, useApi } from '../hooks/useApi'

import './TimeAttendanceTable.scss'

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
  { title: 'สะสม', key: '', width: TABLE_COLUMN_WIDTH },
  { title: 'ใช้สะสม', key: '', width: TABLE_COLUMN_WIDTH },
  { title: (<span>หนี้<br/>(สั่งหยุด)</span>), key: '', width: TABLE_COLUMN_WIDTH },
  { title: (<span>ใช้คืน<br/>(สั่งหยุด)</span>), key: '', width: TABLE_COLUMN_WIDTH },
  { title: (<span>สาย<br/>(นาที)</span>), key: '', width: TABLE_COLUMN_WIDTH },
  { title: (<span>ออกก่อน<br/>(นาที)</span>), key: '', width: TABLE_COLUMN_WIDTH },
  { title: 'ขาด', key: '', width: TABLE_COLUMN_WIDTH },
  { title: 'เบี้ยขยัน', key: '', width: TABLE_COLUMN_WIDTH },
]

const renderTableTitle = () => {
  return (
    <Row align="middle" className="table-title">
      <Col span={8} className="table-title-left">
        <Space direction="vertical" size={2}>
          <div className="title-month">สิงหาคม 2020</div>
          <div className="title-date">ข้อมูลล่าสุดถึงวันที่ <span className="day">11</span> ส.ค.</div>
        </Space>
      </Col>
      <Col span={16} className="table-title-right">
        <Space size={15} className="title-datasource">
          <Space direction="vertical" align="right" size={2}>
            <div className="datasource-file">ไฟล์ข้อมูล <a href="#" className="filename">Input-VTA-08-2020.xlsx</a></div>
            <div className="datasource-uploaded">อัพโหลดเมื่อวันที่ 12 ส.ค. 2563 เวลา 14:00 น.</div>
          </Space>
          <Button icon={<CloudUploadOutlined />}>อัพโหลดไฟล์</Button>
        </Space>
      </Col>
    </Row>
  )
}

const renderOnLoading = () => {
  return (
    <Table bordered loading columns={TABLE_COLUMNS} size="small" pagination={false} scroll={{x: "100%"}} className="time-attendance-table" title={renderTableTitle} />
  )
}

const renderOnSuccess = (data) => {
  return (
    <Table bordered columns={TABLE_COLUMNS} dataSource={data} size="small" pagination={false} scroll={{x: "100%"}} className="time-attendance-table" title={renderTableTitle} />
  )
}

const TimeAttendanceTable = (props) => {

  // TODO : props will tell which month to load data

  const { state, error, data } = useApi('/api/employeeAttendancesTable?month=8&year=2020')

  switch (state) {
    case apiStates.ERROR:
      return <Alert message='Error occurred while loading data' description={error} type='error' showIcon />
    case apiStates.SUCCESS:
      return renderOnSuccess(data.data)
    default:
      return renderOnLoading()
  }
}

export default TimeAttendanceTable
