import React from 'react'
import { Button, Divider, Layout, message, Popconfirm, Space } from 'antd'
import { useAsyncTask } from 'react-hooks-async'

import './SettingsPage.scss'

const { Content } = Layout

const postDeleteEverything = async ({ signal }) => {
  const response = await fetch(`/api/settings/deleteEverything`, { method: 'POST', signal })
  message.success('ล้างข้อมูลเรียบร้อย');
  return response.json()
}

function SettingsPage() {
  const task = useAsyncTask(postDeleteEverything)

  const handleDeleteEverything = () => {
    task.start()
  }

  return (
    <Content className="settings-page">
      <div className="site-layout-content">
        <h1>ตั้งค่าการใช้งาน</h1>
        <Divider orientation="left" plain>การจัดการข้อมูล</Divider>
        <Space direction="vertical">
          <Space direction="vertical">
            <span className="danger-title">ล้างข้อมูลทั้งหมดในระบบ (ข้อมูลสถิติการลงเวลา, บัญชีเงินเดือน, ไฟล์อัพโหลด)</span>
            <Popconfirm placement="right" title="ยืนยันล้างข้อมูล?" onConfirm={handleDeleteEverything} okText="ยืนยัน" cancelText="ยกเลิก">
              <Button danger>ล้างข้อมูล</Button>
            </Popconfirm>
          </Space>
        </Space>
      </div>
    </Content>
  )
}

export default SettingsPage
