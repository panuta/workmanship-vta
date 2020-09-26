import React from 'react'
import { Button, DatePicker, Divider, Input, Layout, message, Popconfirm, Space } from 'antd'
import { LockOutlined } from '@ant-design/icons';
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
        <h1>ตั้งค่าระบบ</h1>
        <Space align="center" className="settings-password">
          <h3><LockOutlined /> รหัสผ่านสำหรับการตั้งค่าระบบ</h3>
          <Input.Password placeholder="กรอกรหัสผ่าน" size="large" />
        </Space>
        <Divider />
        <div className="settings-items">
          <div className="settings-item">
            <div className="settings-title">อัพโหลดข้อมูลเป็นรายเดือน</div>
            <div className="settings-description">ระบบจะดึงข้อมูลจากวันที่ 1 ถึงวันสิ้นเดือนจากไฟล์ที่อัพโหลด</div>
            <Space className="settings-inputs">
              <DatePicker
                picker="month"
                format="MMMM YYYY"
                placeholder="เลือกเดือน" />
                แล้ว
              <Button type="primary">เลือกไฟล์</Button>
            </Space>
          </div>

          <div className="settings-item">
            <div className="settings-title">ล้างข้อมูลทั้งหมดในระบบ</div>
            <div className="settings-description">ข้อมูลสถิติการลงเวลา, บัญชีเงินเดือน, ไฟล์อัพโหลด</div>
            <Space className="settings-inputs">
              <Popconfirm placement="right" title="ยืนยันล้างข้อมูล?" onConfirm={handleDeleteEverything} okText="ยืนยัน" cancelText="ยกเลิก">
                <Button type="primary" danger>ล้างข้อมูล</Button>
              </Popconfirm>
            </Space>
          </div>
        </div>
      </div>
    </Content>
  )
}

export default SettingsPage
