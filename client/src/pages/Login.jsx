import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined, SettingFilled } from '@ant-design/icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleLogin = async (values) => {
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/login', values)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      message.success(`歡迎，${res.data.user.displayName || res.data.user.username}`)
      navigate('/dashboard')
    } catch (err) {
      message.error(err.response?.data?.message || '登入失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <SettingFilled className={styles.icon} spin={loading} />
          <h1 className={styles.title}>MES 系統</h1>
          <p className={styles.subtitle}>製造執行系統</p>
        </div>

        <Form form={form} onFinish={handleLogin} size="large" autoComplete="off">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '請輸入用戶名' }]}
          >
            <Input
              prefix={<UserOutlined className={styles.inputIcon} />}
              placeholder="用戶名"
              autoFocus
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '請輸入密碼' }]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="密碼"
              onPressEnter={() => form.submit()}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className={styles.loginBtn}
            >
              登　入
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.footer}>v1.0.0 &copy; 2025 MES System</div>
      </div>
    </div>
  )
}
