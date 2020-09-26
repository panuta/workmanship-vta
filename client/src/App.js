import React, { useState } from 'react'
import { Switch, Route, Link, useLocation } from 'react-router-dom'
import { Button, Layout, Menu } from 'antd'
import { CloudUploadOutlined, DollarOutlined, SettingOutlined, SolutionOutlined } from '@ant-design/icons'

import './App.scss';
import EmployeesAttendancesPage from './pages/EmployeesAttendancesPage'
import PayrollPage from './pages/PayrollPage'
import SettingsPage from './pages/SettingsPage'
import UploadModal from './components/UploadModal'

const { Header } = Layout

function App() {
  const location = useLocation()

  let selectedKeys = []
  if(location.pathname === '/') selectedKeys.push('1')
  if(location.pathname === '/payroll') selectedKeys.push('2')
  if(location.pathname === '/settings') selectedKeys.push('3')

  // Upload Modal
  const [uploadDrawerVisible, setUploadDrawerVisible] = useState(false)
  const [dataUpdatedTimestamp, setDataUpdatedTimestamp] = useState('')

  const handleUploadButtonClick = () => {
    setUploadDrawerVisible(true)
  }

  const handleUploadSuccess = (uploadedFile) => {
    setUploadDrawerVisible(false)
    const timestamp = (new Date()).getTime().toString(10)
    setDataUpdatedTimestamp(timestamp)
  }
  const handleUploadFailure = () => {
    setUploadDrawerVisible(false)
  }
  const handleUploadCancel = () => {
    setUploadDrawerVisible(false)
  }

  return (
    <Layout className="App">
      <Header className="App-Header">
        <div className="App-Brand">Sahayont Energy</div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} selectedKeys={selectedKeys}>
          <Menu.Item key="1" icon={<SolutionOutlined />}><Link to="/">สถิติวันลา</Link></Menu.Item>
          <Menu.Item key="2" icon={<DollarOutlined />}><Link to="/payroll">บัญชีเงินเดือน</Link></Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}><Link to="/settings">ตั้งค่าระบบ</Link></Menu.Item>
          <Button icon={<CloudUploadOutlined />} onClick={handleUploadButtonClick} className="upload-button">อัพโหลดไฟล์</Button>
        </Menu>
        <UploadModal
          visible={uploadDrawerVisible}
          onSuccess={handleUploadSuccess}
          onFailure={handleUploadFailure}
          onCancel={handleUploadCancel}
        />
      </Header>
      <Switch>
        <Route path="/settings">
          <SettingsPage />
        </Route>
        <Route path="/payroll">
          <PayrollPage />
        </Route>
        <Route path="/">
          <EmployeesAttendancesPage dataUpdatedTimestamp={dataUpdatedTimestamp} />
        </Route>
      </Switch>
    </Layout>
  )
}

export default App
