/**
 * 管理员管理页面
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Form,
  Row,
  Col,
  Tag,
  Avatar,
  Typography,
  Popconfirm,
  message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  UserOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  getAdminListAsync, 
  deleteAdminAsync, 
  clearError 
} from '@/store/slices/adminSlice';
import { useMessage } from '@/utils/message';
import { getSafeAvatarProps } from '@/utils/react19Compatibility';
import type { AdminInfo } from '@/types/admin';
import type { AdminListRequest } from '@/services/adminService';
import CreateAdminModal from './components/CreateAdminModal';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

interface SearchForm {
  keyword: string;
  status?: number;
  isSuperAdmin?: number;
}

const AdminManagementPage: React.FC = () => {
  const message = useMessage();
  const [form] = Form.useForm<SearchForm>();
  const dispatch = useAppDispatch();
  
  const { adminList, total, loading, error } = useAppSelector(state => state.admin);
  const { adminInfo } = useAppSelector(state => state.auth);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // 加载管理员列表
  const loadAdminList = async (params?: Partial<AdminListRequest>) => {
    const searchValues = form.getFieldsValue();
    const queryParams: AdminListRequest = {
      page: currentPage,
      pageSize,
      ...searchValues,
      ...params,
    };

    console.log('📋 加载管理员列表，参数:', queryParams);
    await dispatch(getAdminListAsync(queryParams));
  };

  // 初始加载
  useEffect(() => {
    loadAdminList();
  }, [currentPage, pageSize]);

  // 错误处理
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, message, dispatch]);

  // 搜索处理
  const handleSearch = async (values: SearchForm) => {
    console.log('🔍 搜索管理员，条件:', values);
    setCurrentPage(1);
    await loadAdminList({ page: 1, ...values });
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setCurrentPage(1);
    loadAdminList({ page: 1, keyword: '', status: undefined, isSuperAdmin: undefined });
  };

  // 删除管理员
  const handleDelete = async (record: AdminInfo) => {
    try {
      console.log('🗑️ 删除管理员:', record);
      await dispatch(deleteAdminAsync(record.id)).unwrap();
      message.success('删除管理员成功');
      // 重新加载当前页
      await loadAdminList();
    } catch (error: any) {
      message.error(error.message || '删除管理员失败');
    }
  };

  // 创建成功回调
  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
    message.success('创建管理员成功');
    // 重新加载列表
    loadAdminList();
  };

  // 分页改变
  const handleTableChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // 表格列定义
  const columns: ColumnsType<AdminInfo> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 80,
      render: (avatar, record) => (
        <Avatar 
          {...getSafeAvatarProps(avatar)}
          icon={<UserOutlined />}
          size="default"
        />
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
      render: (username, record) => (
        <Space>
          <span>{username}</span>
          {record.isSuperAdmin && (
            <CrownOutlined style={{ color: '#faad14' }} title="超级管理员" />
          )}
        </Space>
      ),
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 120,
      render: (mobile) => mobile || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '管理员类型',
      dataIndex: 'isSuperAdmin',
      width: 120,
      render: (isSuperAdmin) => (
        <Tag color={isSuperAdmin ? 'gold' : 'blue'}>
          {isSuperAdmin ? '超级管理员' : '普通管理员'}
        </Tag>
      ),
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      width: 180,
      render: (time) => time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: 180,
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '备注',
      dataIndex: 'note',
      width: 150,
      render: (note) => note || '-',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        // 不能删除自己
        const canDelete = adminInfo?.id !== record.id;
        // 只有超级管理员可以删除其他管理员
        const hasDeletePermission = adminInfo?.isSuperAdmin;
        
        return (
          <Space size="middle">
            {hasDeletePermission && canDelete && (
              <Popconfirm
                title="删除管理员"
                description={`确定要删除管理员 "${record.realName}" 吗？此操作不可撤销。`}
                onConfirm={() => handleDelete(record)}
                okText="确定"
                cancelText="取消"
                okType="danger"
              >
                <Button 
                  type="link" 
                  danger 
                  size="small"
                  icon={<DeleteOutlined />}
                >
                  删除
                </Button>
              </Popconfirm>
            )}
            {(!hasDeletePermission || !canDelete) && (
              <span style={{ color: '#ccc' }}>无操作权限</span>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Title level={4}>管理员管理</Title>
        </div>

        {/* 搜索表单 */}
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: '16px' }}
        >
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={6}>
              <Form.Item name="keyword" label="关键词">
                <Input 
                  placeholder="用户名、邮箱、真实姓名" 
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="status" label="状态">
                <Select placeholder="选择状态" allowClear>
                  <Option value={1}>正常</Option>
                  <Option value={0}>禁用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="isSuperAdmin" label="管理员类型">
                <Select placeholder="选择类型" allowClear>
                  <Option value={1}>超级管理员</Option>
                  <Option value={0}>普通管理员</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    loading={loading}
                  >
                    搜索
                  </Button>
                  <Button onClick={handleReset}>
                    重置
                  </Button>
                  {adminInfo?.isSuperAdmin && (
                    <Button 
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setCreateModalVisible(true)}
                    >
                      创建管理员
                    </Button>
                  )}
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* 管理员列表表格 */}
        <Table
          columns={columns}
          dataSource={adminList}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
        />
      </Card>

      {/* 创建管理员模态框 */}
      <CreateAdminModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default AdminManagementPage;