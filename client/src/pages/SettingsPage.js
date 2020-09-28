import React, { useState } from 'react'
import { Button, DatePicker, Input, Layout, message, Popconfirm, Space } from 'antd'
import { LockOutlined } from '@ant-design/icons';
import { useAsyncTask } from 'react-hooks-async'

import './SettingsPage.scss'
import UploadModal from '../components/UploadModal'

const { RangePicker } = DatePicker
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

  // Monthly Upload File
  const [dates, setDates] = useState([])
  const disabledDate = current => {
    if (!dates || dates.length === 0) {
      return false
    }
    return (dates[0] && !current.isSame(dates[0], 'month')) || (dates[1] && !current.isSame(dates[1], 'month'))
  }

  const disableMonthlyUpload = !dates || dates.filter(date => date !== null).length !== 2

  const [uploadModalVisible, setUploadModalVisible] = useState(false)

  const handleUploadButtonClick = () => {
    setUploadModalVisible(true)
  }

  const handleUploadSuccess = (uploadedFile) => {
    setUploadModalVisible(false)
  }
  const handleUploadFailure = () => {
    setUploadModalVisible(false)
  }
  const handleUploadCancel = () => {
    setUploadModalVisible(false)
  }

  return (
    <Content className="settings-page">
      <div className="site-layout-content">
        <h1>ตั้งค่าระบบ</h1>
        <Space align="center" className="settings-password">
          <h3><LockOutlined /> รหัสผ่านสำหรับการตั้งค่าระบบ</h3>
          <Input.Password placeholder="กรอกรหัสผ่าน" size="large" />
        </Space>
        <div className="settings-items">
          <div className="settings-item settings-monthly-upload">
            <div className="settings-title">อัพโหลดข้อมูลเป็นรายเดือน</div>
            <div className="settings-description">เลือกวันที่ที่ต้องการให้ระบบดึงข้อมูลจากไฟล์ (ต้องอยู่ภายในเดือนเดียวกัน) จากนั้นจึงกด "เลือกไฟล์"</div>
            <Space className="settings-inputs">
              <RangePicker
                disabledDate={disabledDate}
                onCalendarChange={value => {
                  setDates(value)
                }}
              />
                แล้ว
              <Button type="primary" onClick={handleUploadButtonClick} disabled={disableMonthlyUpload}>เลือกไฟล์</Button>
              <UploadModal
                dates={dates}
                visible={uploadModalVisible}
                onSuccess={handleUploadSuccess}
                onFailure={handleUploadFailure}
                onCancel={handleUploadCancel}
              />
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
