import React, { useState } from 'react'
import { Form, Input, Button, message, Card, Typography } from 'antd'
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const { Title } = Typography

export default function ChangePassword() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        '/api/auth/change-password',
        { oldPassword: values.oldPassword, newPassword: values.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      message.success('密碼修改成功，請重新登入')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login')
    } catch (err) {
      message.error(err.response?.data?.message || '修改失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ width: 400, borderRadius: 8 }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          style={{ padding: 0, marginBottom: 16 }}
          onClick={() => navigate('/dashboard')}
        >
          返回主功能表
        </Button>

        <Title level={4} style={{ marginBottom: 24 }}>修改密碼</Title>

        <Form form={form} onFinish={handleSubmit} size="large" layout="vertical">
          <Form.Item
            name="oldPassword"
            label="舊密碼"
            rules={[{ required: true, message: '請輸入舊密碼' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="請輸入舊密碼" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密碼"
            rules={[
              { required: true, message: '請輸入新密碼' },
              { min: 3, message: '密碼至少 3 個字元' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="請輸入新密碼" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="確認新密碼"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '請再次輸入新密碼' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('兩次密碼不一致'))
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="請再次輸入新密碼" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              確認修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
