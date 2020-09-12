import React from 'react'
import { DatePicker, Layout, Menu } from 'antd'
import { DollarOutlined, SolutionOutlined } from '@ant-design/icons'

import TimeAttendanceTable from './components/TimeAttendanceTable'

import './App.scss';

const { Header, Content } = Layout

function App() {
  return (
    <Layout className="App">
      <Header className="App-Header">
        <div className="App-Brand">Sahayont Energy</div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<SolutionOutlined />}>สถิติวันลา</Menu.Item>
          <Menu.Item key="2" icon={<DollarOutlined />}>บัญชีเงินเดือน</Menu.Item>
        </Menu>
      </Header>
      <Content key="1" className="App-Content">
        <div className="site-layout-content">
          <div className="Content-Filter">
            <DatePicker picker="month" size="large" />
          </div>
          <TimeAttendanceTable />
        </div>
      </Content>

    </Layout>
  );
}

export default App;
