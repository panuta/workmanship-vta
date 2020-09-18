import React, { useState } from 'react'
import { Alert, Button, Modal, Space, Upload } from 'antd'
import { FileExcelOutlined, WarningOutlined } from '@ant-design/icons';

import './UploadModal.scss'

const UploadModal = ({ monthYear, visible, onSuccess, onFailure, onCancel }) => {
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
        <Alert message="อัพโหลดไฟล์สำเร็จ" type="success" showIcon />
      )
    } else if(uploadedFile.status === 'error') {
      resultElement = (
        <Alert type="error" message={uploadedFile.response.title} />
      )
    }
  }

  const uploadUrl = `/api/uploadFile?month=${monthYear.month() + 1}&year=${monthYear.year()}`

  return (
    <Modal
      title={
        <Space>อัพโหลดไฟล์ สำหรับเดือน <span className="month-year">{monthYear.format('MMMM YYYY')}</span></Space>
      }
      className="upload-modal"
      visible={visible}
      onCancel={handleClose}
      footer={[
        <Button key="back">ปิดหน้าต่าง</Button>
      ]}
    >
      <Space direction="vertical" size={12}>
        <Upload name="file" action={uploadUrl} onChange={handleChange} fileList={fileList}>
          <Button type="primary" icon={<FileExcelOutlined />}>เลือกไฟล์</Button>
        </Upload>
        <div className="warning"><WarningOutlined /> ถ้าหากเดือนที่กำลังอัพโหลดมีข้อมูลอยู่ก่อนแล้ว ข้อมูลของเดือนนั้นๆ จะถูกแทนที่ด้วยข้อมูลจากไฟล์ใหม่</div>
        {resultElement}
      </Space>
    </Modal>
  )
}

export default UploadModal
