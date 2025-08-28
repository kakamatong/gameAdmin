/**
 * 邮件管理页面
 */

import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Form,
  Row,
  Col,
  Space,
  Tag,
  Select,
  Modal,
  message,
  Tooltip,
  Typography,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  MailOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  getMailListAsync, 
  updateMailStatusAsync,
  getMailStatsAsync,
  setCurrentMail 
} from '@/store/slices/mailSlice';
import { MailType, MailStatus, getMailTypeText, getMailStatusText } from '@/types/enums';
import SendMailModal from './components/SendMailModal';
import MailDetailModal from './components/MailDetailModal';
import type { MailItem, MailListRequest } from '@/types';
import './MailManagement.less';

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const MailManagement: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { mailList, total, loading, mailStats } = useAppSelector(state => state.mail);
  
  const [searchParams, setSearchParams] = useState<MailListRequest>({
    page: 1,
    pageSize: 20,
  });
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedMail, setSelectedMail] = useState<MailItem | null>(null);

  // 初始加载数据
  useEffect(() => {
    handleSearch();
    dispatch(getMailStatsAsync());
  }, []);

  // 获取邮件列表
  const handleSearch = async (params?: Partial<MailListRequest>) => {
    const finalParams = { ...searchParams, ...params };
    setSearchParams(finalParams);
    
    try {
      await dispatch(getMailListAsync(finalParams)).unwrap();
    } catch (error) {
      message.error('获取邮件列表失败');
    }
  };

  // 搜索表单提交
  const onSearch = (values: any) => {
    const params: Partial<MailListRequest> = {
      page: 1,
      keyword: values.keyword || undefined,
      status: values.status !== undefined ? values.status : undefined,
      type: values.type !== undefined ? values.type : undefined,
    };
    handleSearch(params);
  };

  // 重置搜索
  const onReset = () => {
    form.resetFields();
    handleSearch({ page: 1, keyword: undefined, status: undefined, type: undefined });
  };

  // 查看邮件详情
  const handleViewDetail = (mail: MailItem) => {
    setSelectedMail(mail);
    dispatch(setCurrentMail(mail));
    setDetailModalVisible(true);
  };

  // 更新邮件状态
  const handleUpdateStatus = (mail: MailItem, status: number) => {
    const statusText = getMailStatusText(status);
    
    confirm({
      title: `确认${statusText}邮件`,
      content: `确定要${statusText}邮件"${mail.title}"吗？`,
      onOk: async () => {
        try {
          await dispatch(updateMailStatusAsync({ 
            mailId: mail.id, 
            data: { status } 
          })).unwrap();
          
          message.success(`邮件${statusText}成功`);
          handleSearch(); // 刷新列表
        } catch (error: any) {
          message.error(error.message || `${statusText}邮件失败`);
        }
      },
    });
  };

  // 分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    handleSearch({ page, pageSize });
  };

  // 表格列定义
  const columns: ColumnsType<MailItem> = [
    {
      title: '邮件ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (text: string, record: MailItem) => (
        <Space>
          <MailOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: number) => {
        const typeText = getMailTypeText(type);
        const color = type === MailType.GLOBAL ? 'blue' : 'green';
        return <Tag color={color}>{typeText}</Tag>;
      },
    },
    {
      title: '内容摘要',
      dataIndex: 'content',
      key: 'content',
      width: 200,
      ellipsis: true,
      render: (content: string) => {
        const summary = content.length > 50 ? content.substring(0, 50) + '...' : content;
        return <span title={content}>{summary}</span>;
      },
    },
    {
      title: '奖励',
      dataIndex: 'awards',
      key: 'awards',
      width: 120,
      render: (awards: string) => {
        if (!awards) return <span>无奖励</span>;
        try {
          const awardList = JSON.parse(awards);
          return (
            <span>
              {Array.isArray(awardList) && awardList.length > 0 ? '有奖励' : '无奖励'}
            </span>
          );
        } catch {
          return <span>无奖励</span>;
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => {
        const statusText = getMailStatusText(status);
        const color = status === MailStatus.ACTIVE ? 'green' : 'red';
        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: '有效期',
      key: 'validity',
      width: 160,
      render: (_, record: MailItem) => {
        const now = new Date();
        const startTime = new Date(record.startTime);
        const endTime = new Date(record.endTime);
        
        let color = 'default';
        let text = '已过期';
        
        if (now < startTime) {
          color = 'orange';
          text = '未开始';
        } else if (now >= startTime && now <= endTime) {
          color = 'green';
          text = '进行中';
        }
        
        return (
          <Space direction="vertical" size={0}>
            <Tag color={color}>{text}</Tag>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {startTime.toLocaleDateString()} - {endTime.toLocaleDateString()}
            </span>
          </Space>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      render: (time: string) => {
        return new Date(time).toLocaleDateString();
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record: MailItem) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === MailStatus.ACTIVE ? '禁用' : '启用'}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleUpdateStatus(record, record.status === MailStatus.ACTIVE ? MailStatus.DISABLED : MailStatus.ACTIVE)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="mail-management">
      <Title level={2}>邮件管理</Title>
      
      {/* 统计卡片 */}
      {mailStats && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={6}>
            <Card size="small">
              <div className="stat-card">
                <div className="stat-number">{mailStats.totalMails}</div>
                <div className="stat-label">总邮件</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <div className="stat-card">
                <div className="stat-number" style={{ color: '#52c41a' }}>{mailStats.activeMails}</div>
                <div className="stat-label">活跃邮件</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <div className="stat-card">
                <div className="stat-number" style={{ color: '#1890ff' }}>{mailStats.globalMails}</div>
                <div className="stat-label">全服邮件</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <div className="stat-card">
                <div className="stat-number" style={{ color: '#722ed1' }}>{mailStats.personalMails}</div>
                <div className="stat-label">个人邮件</div>
              </div>
            </Card>
          </Col>
        </Row>
      )}
      
      {/* 搜索表单 */}
      <Card className="search-card" variant="borderless">
        <Form
          form={form}
          layout="inline"
          onFinish={onSearch}
          className="search-form"
        >
          <Row gutter={16} style={{ width: '100%' }}>
            <Col xs={24} sm={8} md={6}>
              <Form.Item name="keyword" style={{ width: '100%' }}>
                <Input
                  placeholder="搜索邮件标题"
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Form.Item name="type" style={{ width: '100%' }}>
                <Select placeholder="邮件类型" allowClear>
                  <Option value={MailType.GLOBAL}>全服邮件</Option>
                  <Option value={MailType.PERSONAL}>个人邮件</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Form.Item name="status" style={{ width: '100%' }}>
                <Select placeholder="状态" allowClear>
                  <Option value={MailStatus.ACTIVE}>启用</Option>
                  <Option value={MailStatus.DISABLED}>禁用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  搜索
                </Button>
                <Button onClick={onReset}>
                  重置
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => handleSearch({ page: 1 })}
                  loading={loading}
                >
                  刷新
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 邮件表格 */}
      <Card variant="borderless">
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setSendModalVisible(true)}
          >
            发送邮件
          </Button>
        </div>
        
        <Table<MailItem>
          columns={columns}
          dataSource={mailList}
          rowKey="id"
          loading={loading}
          pagination={{
            current: searchParams.page,
            pageSize: searchParams.pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: handleTableChange,
            onShowSizeChange: (current, size) => handleTableChange(current, size),
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 发送邮件模态框 */}
      <SendMailModal
        visible={sendModalVisible}
        onClose={() => setSendModalVisible(false)}
        onSuccess={() => {
          setSendModalVisible(false);
          handleSearch(); // 刷新列表
          dispatch(getMailStatsAsync()); // 刷新统计
        }}
      />

      {/* 邮件详情模态框 */}
      <MailDetailModal
        visible={detailModalVisible}
        mail={selectedMail}
        onClose={() => setDetailModalVisible(false)}
      />
    </div>
  );
};

export default MailManagement;