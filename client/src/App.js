import React from 'react'
import { Switch, Route, Link, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { DollarOutlined, SettingOutlined, SolutionOutlined } from '@ant-design/icons'

import './App.scss';
import EmployeeAttendancesPage from './pages/EmployeeAttendancesPage'
import PayrollPage from './pages/PayrollPage'
import SettingsPage from './pages/SettingsPage'

const { Header } = Layout

function App() {
  const location = useLocation()

  let selectedKeys = []
  if(location.pathname === '/') selectedKeys.push('1')
  if(location.pathname === '/payroll') selectedKeys.push('2')
  if(location.pathname === '/settings') selectedKeys.push('3')

  return (
    <Layout className="App">
      <Header className="App-Header">
        <div className="App-Brand">Sahayont Energy</div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} selectedKeys={selectedKeys}>
          <Menu.Item key="1" icon={<SolutionOutlined />}><Link to="/">สถิติวันลา</Link></Menu.Item>
          <Menu.Item key="2" icon={<DollarOutlined />}><Link to="/payroll">บัญชีเงินเดือน</Link></Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}><Link to="/settings">ตั้งค่าการใช้งาน</Link></Menu.Item>
        </Menu>
      </Header>
      <Switch>
        <Route path="/settings">
          <SettingsPage />
        </Route>
        <Route path="/payroll">
          <PayrollPage />
        </Route>
        <Route path="/">
          <EmployeeAttendancesPage />
        </Route>
      </Switch>
    </Layout>
  )
}

export default App;
