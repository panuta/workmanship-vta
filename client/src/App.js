import React from 'react';
import { Button, DatePicker, Dropdown, Table, Row, Col } from 'antd';

import { Layout, Menu, Space } from 'antd';
import { CloudDownloadOutlined, CloudUploadOutlined, DownOutlined, SolutionOutlined } from '@ant-design/icons';

import './App.scss';

const { Header, Content } = Layout;

function App() {
  const columns = [
    {
      title: 'พนักงาน',
      key: 'employee',
      render: (text, record, index) => (
        <Space direction="vertical">
          <div className="Employee-Title">{record.employeeFullName} ({record.employeeNickName})</div>
          <div className="Employee-Subtitle">รหัส: <span className="value">{record.employeeCode}</span> <span className="divider">|</span> ตำแหน่ง: <span className="value">{record.employeePosition}</span></div>
        </Space>
      )
    },
    {
      title: 'ใบเตือน',
      key: ''
    },
    {
      title: 'พักร้อน',
      key: ''
    },
    {
      title: 'ลาป่วย',
      key: ''
    },
    {
      title: 'ลากิจ',
      key: ''
    },
    {
      title: (<span>ลากิจ<br/>(หักเงิน)</span>),
      key: ''
    },
    {
      title: 'สะสม',
      key: ''
    },
    {
      title: 'ใช้สะสม',
      key: ''
    },
    {
      title: (<span>หนี้<br/>(สั่งหยุด)</span>),
      key: ''
    },
    {
      title: (<span>ใช้คืน<br/>(สั่งหยุด)</span>),
      key: ''
    },
    {
      title: (<span>สาย<br/>(นาที)</span>),
      key: ''
    },
    {
      title: (<span>ออกก่อน<br/>(นาที)</span>),
      key: ''
    },
    {
      title: 'ขาด',
      key: ''
    },
    {
      title: 'เบี้ยขยัน',
      key: ''
    },
  ];

  const data = [
    {
      key: '110008',
      employeeCode: '110008',
      employeeFullName: 'นางสาวเรณู ไชยนาศรี',
      employeeNickName: 'ส้ม',
      employeeCompany: 'SE',
      employeeStatus: 'รายเดือน',
      employeeDepartment: 'บัญชีและการเงิน',
      employeePosition: 'พนักงานบัญชี',
    },
    {
      key: '110014',
      employeeCode: '110014',
      employeeFullName: 'นางสาวนฤมล ธนาพิทักษ์กูล',
      employeeNickName: 'กิ๊ฟ',
      employeeCompany: 'SE',
      employeeStatus: 'รายเดือน',
      employeeDepartment: 'บัญชีและการเงิน',
      employeePosition: 'พนักงานบัญชี',
    },
    {
      key: '110015',
      employeeCode: '110015',
      employeeFullName: 'นางสาววรุฬศิริ บุญสนอง',
      employeeNickName: 'ตาล',
      employeeCompany: 'SE',
      employeeStatus: 'รายเดือน',
      employeeDepartment: 'บัญชีและการเงิน',
      employeePosition: 'หัวหน้าแผนกการเงิน',
    },
  ];

  // const tableTitle = () => {
  //   return 'Header'
  // }

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<CloudDownloadOutlined />}>ดาวน์โหลดไฟล์โปรแกรม Tiger</Menu.Item>
    </Menu>
  );

  const tableTitle = () => (
    <Row justify="space-between" align="middle">
      <Col span={16} className="Table-Title-Left">
        <Space direction="vertical" size={7}>
          <div className="Table-Title-Month">สิงหาคม 2020</div>
          <div className="Table-Title-Datasource">ไฟล์ข้อมูล <a href="#" className="filename">Input-VTA-08-2020.xlsx</a> <Button size="small" icon={<CloudUploadOutlined />}>อัพโหลดไฟล์ใหม่</Button></div>
        </Space>
      </Col>
      <Col span={8} className="Table-Title-Right">
        <Space align="center">
          <Dropdown overlay={menu} placement="bottomRight">
            <Button>ดาวน์โหลด <DownOutlined /></Button>
          </Dropdown>
        </Space>
      </Col>
    </Row>
  )

  return (
    <Layout className="App">
      <Header className="App-Header">
        <div className="App-Brand">Sahayont Energy</div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<SolutionOutlined />}>สถิติวันลา</Menu.Item>
        </Menu>
      </Header>
      <Content className="App-Content">
        <div className="site-layout-content">
          <div className="Content-Filter">
            <DatePicker picker="month" />
          </div>
          <Table bordered columns={columns} dataSource={data} size="small" pagination={false} className="Content-Table" title={tableTitle} />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
