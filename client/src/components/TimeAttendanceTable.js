import React from 'react'
import { Button, Table, Row, Col } from 'antd'

import { Space } from 'antd'
import {
  CloudUploadOutlined,
} from '@ant-design/icons'

import './TimeAttendanceTable.scss'

function TimeAttendanceTable(props) {
  const colWidth = 80

  const tableColumns = [
    {
      title: 'พนักงาน',
      key: 'employee',
      fixed: 'left',
      width: 350,
      render: (text, record, index) => (
        <Space direction="vertical" size={2}>
          <div className="employee-title">{record.employeeFullName} ({record.employeeNickName})</div>
          <div className="employee-subtitle">รหัส: <span className="value">{record.employeeCode}</span> <span className="divider">|</span> ตำแหน่ง: <span className="value">{record.employeePosition}</span></div>
        </Space>
      )
    },
    {
      title: 'สถานะพนักงาน',
      dataIndex: 'employeeStatus',
      key: 'employeeStatus',
      align: 'center',
      width: 140
    },
    {
      title: 'ใบเตือน',
      align: 'center',
      width: colWidth
    },
    {
      title: 'พักร้อน',
      width: colWidth
    },
    {
      title: 'ลาป่วย',
      key: '',
      width: colWidth
    },
    {
      title: 'ลากิจ',
      key: '',
      width: colWidth
    },
    {
      title: (<span>ลากิจ<br/>(หักเงิน)</span>),
      key: '',
      width: colWidth
    },
    {
      title: 'สะสม',
      key: '',
      width: colWidth
    },
    {
      title: 'ใช้สะสม',
      key: '',
      width: colWidth
    },
    {
      title: (<span>หนี้<br/>(สั่งหยุด)</span>),
      key: '',
      width: colWidth
    },
    {
      title: (<span>ใช้คืน<br/>(สั่งหยุด)</span>),
      key: '',
      width: colWidth
    },
    {
      title: (<span>สาย<br/>(นาที)</span>),
      key: '',
      width: colWidth
    },
    {
      title: (<span>ออกก่อน<br/>(นาที)</span>),
      key: '',
      width: colWidth
    },
    {
      title: 'ขาด',
      key: '',
      width: colWidth
    },
    {
      title: 'เบี้ยขยัน',
      key: '',
      width: colWidth
    },
  ]

  const tableTitleComponent = () => (
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

  return (
    <Table bordered columns={tableColumns} dataSource={props.data} size="small" pagination={false} scroll={{x: "100%"}} className="time-attendance-table" title={tableTitleComponent} />
  )
}

export default TimeAttendanceTable
