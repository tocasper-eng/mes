import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Typography, message } from 'antd'
import { LockOutlined, LogoutOutlined, SettingFilled, SearchOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const menuItems = [
  {
    key: 'csla-query',
    icon: <SearchOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    label: 'CSLA 查詢',
    path: '/csla-query',
  },
  {
    key: 'change-password',
    icon: <LockOutlined style={{ fontSize: 32, color: '#1677ff' }} />,
    label: '修改密碼',
    path: '/change-password',
  },
  {
    key: 'logout',
    icon: <LogoutOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />,
    label: '退出系統',
    path: null,
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleClick = (item) => {
    if (item.key === 'logout') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      message.success('已退出系統')
      navigate('/login')
    } else {
      navigate(item.path)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <SettingFilled style={{ fontSize: 28, color: '#1677ff' }} />
          <div>
            <Title level={3} style={{ margin: 0 }}>MES 系統</Title>
            <Text type="secondary">歡迎，{user.displayName || user.username}</Text>
          </div>
        </div>

        <Title level={5} style={{ marginBottom: 16, color: '#666' }}>主功能表</Title>

        <Row gutter={[16, 16]}>
          {menuItems.map((item) => (
            <Col xs={12} sm={8} key={item.key}>
              <Card
                hoverable
                style={{ textAlign: 'center', borderRadius: 8 }}
                styles={{ body: { padding: '32px 16px' } }}
                onClick={() => handleClick(item)}
              >
                {item.icon}
                <div style={{ marginTop: 12, fontWeight: 500, fontSize: 15 }}>
                  {item.label}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}
