import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { DollarOutlined, SolutionOutlined } from '@ant-design/icons'

import './App.scss';
import EmployeeAttendancesPage from './pages/EmployeeAttendancesPage'
import PayrollPage from './pages/PayrollPage'

const { Header } = Layout

function App() {
  return (
    <Router>
      <Layout className="App">
        <Header className="App-Header">
          <div className="App-Brand">Sahayont Energy</div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<SolutionOutlined />}><Link to="/">สถิติวันลา</Link></Menu.Item>
            <Menu.Item key="2" icon={<DollarOutlined />}><Link to="/payroll">บัญชีเงินเดือน</Link></Menu.Item>
          </Menu>
        </Header>
        <Switch>
          <Route path="/payroll">
            <PayrollPage />
          </Route>
          <Route path="/">
            <EmployeeAttendancesPage />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
