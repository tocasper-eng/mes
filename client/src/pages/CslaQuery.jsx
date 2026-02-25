import React, { useState, useEffect } from 'react'
import { Table, Input, Select, Button, Row, Col, Card, Typography, Space, message } from 'antd'
import { SearchOutlined, ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const { Title } = Typography

const columns = [
  { title: 'Activity Type', dataIndex: 'LSTAR', key: 'LSTAR', width: 120, sorter: (a, b) => a.LSTAR.localeCompare(b.LSTAR) },
  { title: 'Name', dataIndex: 'LTEXT', key: 'LTEXT', width: 200 },
  { title: 'Controlling Area', dataIndex: 'KOKRS', key: 'KOKRS', width: 130 },
  { title: 'CCtr Categories', dataIndex: 'KSTTY', key: 'KSTTY', width: 120 },
  { title: 'Activity Unit', dataIndex: 'LEINH', key: 'LEINH', width: 110 },
  { title: 'Allocation Cost Elem', dataIndex: 'VKSTA', key: 'VKSTA', width: 160 },
  { title: 'ATyp Category', dataIndex: 'LATYP', key: 'LATYP', width: 110 },
]

export default function CslaQuery() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ lstar: '', ltext: '', kokrs: '', kstty: '' })

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
    if (filters.kokrs) params.kokrs = filters.kokrs
    if (filters.kstty) params.kstty = filters.kstty
    fetchData(params)
  }

  const handleReset = () => {
    setFilters({ lstar: '', ltext: '', kokrs: '', kstty: '' })
    fetchData()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            style={{ padding: 0 }}
            onClick={() => navigate('/dashboard')}
          >
            返回主功能表
          </Button>
        </div>

        <Title level={4} style={{ marginBottom: 16 }}>CSLA Activity Type 查詢</Title>

        <Card style={{ marginBottom: 16, borderRadius: 8 }}>
          <Row gutter={[16, 12]} align="bottom">
            <Col xs={24} sm={6}>
              <div style={{ marginBottom: 4, fontSize: 13, color: '#666' }}>Activity Type</div>
              <Input
                placeholder="輸入 Activity Type"
                value={filters.lstar}
                onChange={(e) => setFilters({ ...filters, lstar: e.target.value })}
                onPressEnter={handleSearch}
                allowClear
              />
            </Col>
            <Col xs={24} sm={6}>
              <div style={{ marginBottom: 4, fontSize: 13, color: '#666' }}>Name</div>
              <Input
                placeholder="輸入名稱"
                value={filters.ltext}
                onChange={(e) => setFilters({ ...filters, ltext: e.target.value })}
                onPressEnter={handleSearch}
                allowClear
              />
            </Col>
            <Col xs={24} sm={5}>
              <div style={{ marginBottom: 4, fontSize: 13, color: '#666' }}>Controlling Area</div>
              <Select
                placeholder="選擇 Controlling Area"
                style={{ width: '100%' }}
                value={filters.kokrs || undefined}
                onChange={(val) => setFilters({ ...filters, kokrs: val || '' })}
                allowClear
                options={[{ value: 'CYPG', label: 'CYPG' }]}
              />
            </Col>
            <Col xs={24} sm={4}>
              <div style={{ marginBottom: 4, fontSize: 13, color: '#666' }}>CCtr Categories</div>
              <Select
                placeholder="選擇"
                style={{ width: '100%' }}
                value={filters.kstty || undefined}
                onChange={(val) => setFilters({ ...filters, kstty: val || '' })}
                allowClear
                options={[
                  { value: 'Q', label: 'Q' },
                  { value: 'W', label: 'W' },
                ]}
              />
            </Col>
            <Col xs={24} sm={3}>
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
            rowKey={(r) => `${r.KOKRS}-${r.LSTAR}`}
            loading={loading}
            size="middle"
            scroll={{ x: 900 }}
            pagination={{ pageSize: 20, showSizeChanger: true, showQuickJumper: true }}
          />
        </Card>
      </div>
    </div>
  )
}
