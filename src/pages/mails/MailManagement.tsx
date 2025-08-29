/**
 * 邮件管理页面
 */

import React, { useState } from 'react';
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
  Typography,
  InputNumber,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EyeOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  getUserMailListAsync,
  setCurrentMail 
} from '@/store/slices/mailSlice';
import { getMailTypeText, getUserMailStatusText } from '@/types/enums';
import { useMessage } from '@/utils/message';
import SendMailModal from './components/SendMailModal';
import MailDetailModal from './components/MailDetailModal';
import type { UserMailItem, UserMailListRequest } from '@/types';
import './MailManagement.less';

const { Title } = Typography;

const MailManagement: React.FC = () => {
  const message = useMessage();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { userMailList, total, loading } = useAppSelector(state => state.mail);
  
  const [searchParams, setSearchParams] = useState<UserMailListRequest>({
    page: 1,
    pageSize: 20,
  });
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedMail, setSelectedMail] = useState<UserMailItem | null>(null);

  // 获取用户邮件列表
  const handleSearch = async (params?: Partial<UserMailListRequest>) => {
    const finalParams = { ...searchParams, ...params };
    setSearchParams(finalParams);
    
    try {
      await dispatch(getUserMailListAsync(finalParams)).unwrap();
    } catch (error) {
      message.error('获取用户邮件列表失败');
    }
  };

  // 搜索表单提交
  const onSearch = (values: any) => {
    if (!values.userid) {
      message.warning('请输入用户ID');
      return;
    }
    
    const params: Partial<UserMailListRequest> = {
      page: 1,
      userid: values.userid,
      title: values.title || undefined,
    };
    handleSearch(params);
  };

  // 重置搜索
  const onReset = () => {
    form.resetFields();
    setSearchParams({ page: 1, pageSize: 20 });
    // 可以在这里清空列表数据
  };

  // 查看邮件详情
  const handleViewDetail = (mail: UserMailItem) => {
    setSelectedMail(mail);
    dispatch(setCurrentMail(mail));
    setDetailModalVisible(true);
  };

  // 分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    handleSearch({ page, pageSize });
  };

  // 表格列定义
  const columns: ColumnsType<UserMailItem> = [
    {
      title: '邮件ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户ID',
      dataIndex: 'userid',
      key: 'userid',
      width: 100,
      render: (userid: number) => (
        <Space>
          <UserOutlined />
          <span>{userid}</span>
        </Space>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (text: string) => (
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
        const color = type === 0 ? 'blue' : 'green';
        return <Tag color={color}>{typeText}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => {
        const statusText = getUserMailStatusText(status);
        let color = 'default';
        if (status === 0) color = 'red';         // 未读
        else if (status === 1) color = 'orange'; // 已读
        else if (status === 2) color = 'green';  // 已领取
        else if (status === 3) color = 'gray';   // 已删除
        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: '有效期',
      key: 'validity',
      width: 160,
      render: (_, record: UserMailItem) => {
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
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (time: string) => {
        return new Date(time).toLocaleDateString();
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record: UserMailItem) => (
        <Tooltip title="查看详情">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="mail-management">
      <Title level={2}>邮件管理</Title>
      
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
              <Form.Item 
                name="userid" 
                style={{ width: '100%' }}
                rules={[{ required: true, message: '请输入用户ID' }]}
              >
                <InputNumber
                  placeholder="用户ID（必填）"
                  style={{ width: '100%' }}
                  min={1}
                  precision={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Form.Item name="title" style={{ width: '100%' }}>
                <Input
                  placeholder="搜索邮件标题"
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  搜索
                </Button>
                <Button onClick={onReset}>
                  重置
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    const userid = form.getFieldValue('userid');
                    if (userid) {
                      handleSearch({ page: 1 });
                    }
                  }}
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
        
        <Table<UserMailItem>
          columns={columns}
          dataSource={userMailList}
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
          message.success('邮件发送成功');
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