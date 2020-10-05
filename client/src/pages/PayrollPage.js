import React from 'react'
import moment from 'moment'
import { Layout, Space, Table } from 'antd'

import './PayrollPage.scss'

const { Content } = Layout

const TABLE_COLUMNS = [
  { title: 'งวดเดือน', dataIndex: 'monthYear', align: 'left', width: 240,
    render: (text, record, index) => {
      return <span>{moment(text).format('MMMM YYYY')}</span>
    }
  },
  { title: 'ดาวน์โหลดไฟล์', dataIndex: 'files', align: 'left',
    render: (text, record, index) => (
      <Space>
        <a href="#">files</a>
      </Space>
    )
  }
]

const RESULT = [
  { monthYear: '2020-10-01', files: { payroll: 'file1', another: 'file2' } },
  { monthYear: '2020-09-01', files: { payroll: 'file1', another: 'file2' } },
]

function PayrollPage() {
  return (
    <Content className="payroll-page">
      <div className="site-layout-content">
        <Table
          bordered
          columns={TABLE_COLUMNS}
          dataSource={RESULT}
          size="small"
          pagination={false}
          scroll={{x: "100%"}}
          className="payroll-table"
        />
      </div>
    </Content>
  )
}

export default PayrollPage
