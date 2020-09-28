import moment from 'moment'
import React, { useState } from 'react'
import { Alert, Button, Modal, Space, Upload } from 'antd'
import { FileExcelOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import './UploadModal.scss'

const UploadModal = ({ dates, visible, onSuccess, onFailure, onCancel }) => {
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

  // dates parameter
  let uploadDateText
  let uploadUrl
  if(Array.isArray(dates) && dates.filter(date => date !== null).length === 2) {
    uploadDateText = `${dates[0].date()} - ${dates[1].date()} ${moment(dates[0]).format('MMMM YYYY')}`
    uploadUrl = `/api/uploadMonthlyFile?from=${dates[0].format('YYYY-MM-DD')}&to=${dates[1].format('YYYY-MM-DD')}`
  } else {
    // Default to yesterday
    uploadDateText = moment().subtract(1, 'days').format('วันddd ที่ D MMMM YYYY')
    uploadUrl = '/api/uploadDailyFile'
  }

  return (
    <Modal
      title={
        <Space>อัพโหลดไฟล์สำหรับ <span className="upload-date">{uploadDateText}</span></Space>
      }
      className="upload-modal"
      visible={visible}
      onCancel={handleClose}
      footer={[
        <Button onClick={handleClose}>ปิดหน้าต่าง</Button>
      ]}
    >
      <Space direction="vertical" size={10}>
        <div className="upload-button">
          <Upload name="file" action={uploadUrl} onChange={handleChange} fileList={fileList}>
            <Button type="primary" icon={<FileExcelOutlined />}>เลือกไฟล์</Button>
          </Upload>
        </div>
        {resultElement}
        <div className="warning"><ExclamationCircleOutlined /> <strong>กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนอัพโหลด</strong> ผู้ใช้สามารถอัพโหลดข้อมูลในแต่ละวันได้เพียงครั้งเดียว</div>
        <div className="warning"><ExclamationCircleOutlined /> ถ้าไฟล์ Excel มีข้อมูลใส่อยู่หลายวัน ระบบจะเลือกเฉพาะวันที่ระบุไว้เท่านั้น</div>
      </Space>
    </Modal>
  )
}

export default UploadModal
