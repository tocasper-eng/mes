import React, { useState, useEffect } from 'react'
import { Table, Input, Button, Row, Col, Card, Typography, Space, message } from 'antd'
import { SearchOutlined, ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const { Title } = Typography

const columns = [
  { title: '作業編號', dataIndex: 'LSTAR',  key: 'LSTAR',  width: 120, sorter: (a, b) => a.LSTAR.localeCompare(b.LSTAR) },
  { title: '作業名稱', dataIndex: 'LTEXT',  key: 'LTEXT',  width: 250 },
  { title: '備註說明', dataIndex: 'remark', key: 'remark', width: 300 },
]

export default function CslaQuery() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ lstar: '', ltext: '' })

  const fetchData = async (params = {}) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/csla', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      setData(res.data)
    } catch (err) {
      if (err.response?.status === 401) {
        message.error('登入已過期，請重新登入')
        navigate('/login')
      } else {
        message.error('查詢失敗，請稍後再試')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = () => {
    const params = {}
    if (filters.lstar) params.lstar = filters.lstar
    if (filters.ltext) params.ltext = filters.ltext
    fetchData(params)
  }

  const handleReset = () => {
    setFilters({ lstar: '', ltext: '' })
    fetchData()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <div style={{ marginBottom: 20 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            style={{ padding: 0 }}
            onClick={() => navigate('/dashboard')}
          >
            返回主功能表
          </Button>
        </div>

        <Title level={4} style={{ marginBottom: 16 }}>作業類型查詢</Title>

        <Card style={{ marginBottom: 16, borderRadius: 8 }}>
          <Row gutter={[16, 12]} align="bottom">
            <Col xs={24} sm={8}>
              <div style={{ marginBottom: 4, fontSize: 13, color: '#666' }}>作業編號</div>
              <Input
                placeholder="輸入作業編號"
                value={filters.lstar}
                onChange={(e) => setFilters({ ...filters, lstar: e.target.value })}
                onPressEnter={handleSearch}
                allowClear
              />
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ marginBottom: 4, fontSize: 13, color: '#666' }}>作業名稱</div>
              <Input
                placeholder="輸入作業名稱"
                value={filters.ltext}
                onChange={(e) => setFilters({ ...filters, ltext: e.target.value })}
                onPressEnter={handleSearch}
                allowClear
              />
            </Col>
            <Col xs={24} sm={4}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  查詢
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card style={{ borderRadius: 8 }}>
          <div style={{ marginBottom: 8, color: '#666', fontSize: 13 }}>
            共 {data.length} 筆
          </div>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="LSTAR"
            loading={loading}
            size="middle"
            pagination={{ pageSize: 20, showSizeChanger: true, showQuickJumper: true }}
          />
        </Card>
      </div>
    </div>
  )
}
