import React from 'react'
import { DatePicker, Layout, Menu } from 'antd'
import { DollarOutlined, SolutionOutlined } from '@ant-design/icons'

import TimeAttendanceTable from './components/TimeAttendanceTable'

import './App.scss';

const { Header, Content } = Layout

function App() {
  const timeAttendanceData = [
    {
      key: '110008',
      employeeCode: '110008',
      employeeFullName: 'เรณู ไชยนาศรี',
      employeeNickName: 'ส้ม',
      employeeCompany: 'SE',
      employeeStatus: 'รายเดือน',
      employeeDepartment: 'บัญชีและการเงิน',
      employeePosition: 'พนักงานบัญชี',
    },
    {
      key: '110014',
      employeeCode: '110014',
      employeeFullName: 'นฤมล ธนาพิทักษ์กูล',
      employeeNickName: 'กิ๊ฟ',
      employeeCompany: 'SE',
      employeeStatus: 'รายเดือน',
      employeeDepartment: 'บัญชีและการเงิน',
      employeePosition: 'พนักงานบัญชี',
    },
    {
      key: '110015',
      employeeCode: '110015',
      employeeFullName: 'วรุฬศิริ บุญสนอง',
      employeeNickName: 'ตาล',
      employeeCompany: 'SE',
      employeeStatus: 'รายเดือน',
      employeeDepartment: 'บัญชีและการเงิน',
      employeePosition: 'หัวหน้าแผนกการเงิน',
    },
  ]

  return (
    <Layout className="App">
      <Header className="App-Header">
        <div className="App-Brand">Sahayont Energy</div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<SolutionOutlined />}>สถิติวันลา</Menu.Item>
          <Menu.Item key="2" icon={<DollarOutlined />}>บัญชีเงินเดือน</Menu.Item>
        </Menu>
      </Header>
      <Content className="App-Content">
        <div className="site-layout-content">
          <div className="Content-Filter">
            <DatePicker picker="month" />
          </div>
          <TimeAttendanceTable data={timeAttendanceData} />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
