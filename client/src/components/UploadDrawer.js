import React, { useState } from 'react'
import { Alert, Button, Drawer, Space, Upload } from 'antd'
import { CloseOutlined, FileExcelOutlined } from '@ant-design/icons';

import './UploadDrawer.scss'

const UploadDrawer = ({ monthYear, visible, onSuccess, onFailure, onCancel }) => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileList, setFileList] = useState([])

  const resetState = () => {
    setUploadedFile(null)
    setFileList([])
  }

  const handleChange = ({file, fileList, event}) => {
    fileList = fileList.slice(-1)
    setUploadedFile(file)
    setFileList(fileList)
  }

  const handleClose = () => {
    if(uploadedFile) {
      if(uploadedFile.status === 'done') {
        onSuccess && onSuccess(uploadedFile)
        resetState()
      } else if(uploadedFile.status === 'error') {
        onFailure && onFailure(uploadedFile)
        resetState()
      }
    } else {
      onCancel && onCancel()
      resetState()
    }
  }

  let resultElement = ''
  if(uploadedFile) {
    if(uploadedFile.status === 'done') {
      resultElement = (
        <Space direction="vertical" className="uploaded-result" size={15}>
          <Alert message="อัพโหลดไฟล์สำเร็จ" type="success" showIcon />
          <Button size="large" onClick={handleClose} icon={<CloseOutlined />}>ปิดหน้าอัพโหลด</Button>
        </Space>
      )
    } else if(uploadedFile.status === 'error') {
      const errors = [uploadedFile.response.title]
      resultElement = (
        <Space direction="vertical" className="uploaded-result">
          {errors.map(error => <Alert type="error" message={error} />)}
        </Space>
      )
    }
  }

  const uploadUrl = `/api/uploadFile?month=${monthYear.month() + 1}&year=${monthYear.year()}`

  return (
    <Drawer
      title="อัพโหลดไฟล์ Excel"
      placement="right"
      closable={true}
      onClose={handleClose}
      visible={visible}
      width="400"
      className="upload-drawer"
    >
      <Space direction="vertical" size={15}>
        <div className="target-month-year">สำหรับเดือน <span className="month-year">{monthYear.format('MMMM YYYY')}</span></div>
        <div className="replace-warning">ถ้าหากเดือนที่กำลังอัพโหลดมีข้อมูลอยู่ก่อนแล้ว ข้อมูลของเดือนนั้นๆ จะถูกแทนที่ด้วยข้อมูลจากไฟล์ใหม่</div>
        <Upload name="file" action={uploadUrl} onChange={handleChange} fileList={fileList}>
          <Button size="large" type="primary" icon={<FileExcelOutlined />}>เลือกไฟล์อัพโหลด</Button>
        </Upload>
        {resultElement}
      </Space>
    </Drawer>
  )
}

export default UploadDrawer;
