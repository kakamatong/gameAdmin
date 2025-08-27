/**
 * 用户管理页面
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
  Modal,
  message,
  Tooltip,
  Typography,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  EyeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/store';
import { getUserListAsync, setCurrentUser } from '@/store/slices/userSlice';
import UserDetailModal from './components/UserDetailModal';
import UserEditModal from './components/UserEditModal';
import type { UserInfo, UserListRequest } from '@/types';
import './UserManagement.less';

const { Title } = Typography;

const UserManagement: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { userList, total, loading } = useAppSelector(state => state.user);
  
  const [searchParams, setSearchParams] = useState<UserListRequest>({
    page: 1,
    pageSize: 20,
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

  // 初始加载数据
  useEffect(() => {
    handleSearch();
  }, []);

  // 获取用户列表
  const handleSearch = async (params?: Partial<UserListRequest>) => {
    const finalParams = { ...searchParams, ...params };
    setSearchParams(finalParams);
    
    try {
      await dispatch(getUserListAsync(finalParams)).unwrap();
    } catch (error) {
      message.error('获取用户列表失败');
    }
  };

  // 搜索表单提交
  const onSearch = (values: any) => {
    const params: Partial<UserListRequest> = {
      page: 1,
      keyword: values.keyword || undefined,
      userid: values.userid || undefined,
    };
    handleSearch(params);
  };

  // 重置搜索
  const onReset = () => {
    form.resetFields();
    handleSearch({ page: 1, keyword: undefined, userid: undefined });
  };

  // 查看用户详情
  const handleViewDetail = (user: UserInfo) => {
    setSelectedUser(user);
    dispatch(setCurrentUser(user));
    setDetailModalVisible(true);
  };

  // 编辑用户
  const handleEditUser = (user: UserInfo) => {
    setSelectedUser(user);
    dispatch(setCurrentUser(user));
    setEditModalVisible(true);
  };

  // 分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    handleSearch({ page, pageSize });
  };

  // 表格列定义
  const columns: ColumnsType<UserInfo> = [
    {
      title: '用户ID',
      dataIndex: 'userid',
      key: 'userid',
      width: 100,
      sorter: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 150,
      ellipsis: true,
      render: (text: string, record: UserInfo) => (
        <Space>
          <UserOutlined />
          <span>{text || '未设置'}</span>
        </Space>
      ),
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      width: 80,
      render: (sex: number) => {
        const sexMap = { 0: '未知', 1: '男', 2: '女' };
        return sexMap[sex as keyof typeof sexMap] || '未知';
      },
    },
    {
      title: '地区',
      key: 'location',
      width: 150,
      ellipsis: true,
      render: (_, record: UserInfo) => {
        const location = [record.province, record.city].filter(Boolean).join(' ');
        return location || '未知';
      },
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 120,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '财富',
      key: 'riches',
      width: 150,
      render: (_, record: UserInfo) => {
        const goldRich = record.riches?.find(r => r.richType === 1);
        const diamondRich = record.riches?.find(r => r.richType === 2);
        
        return (
          <Space direction="vertical" size={0}>
            <span>金币: {goldRich?.richNums || 0}</span>
            <span>钻石: {diamondRich?.richNums || 0}</span>
          </Space>
        );
      },
    },
    {
      title: '注册时间',
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
      width: 120,
      fixed: 'right',
      render: (_, record: UserInfo) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="编辑用户">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-management">
      <Title level={2}>用户管理</Title>
      
      {/* 搜索表单 */}
      <Card className="search-card" bordered={false}>
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
                  placeholder="搜索昵称"
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Form.Item name="userid" style={{ width: '100%' }}>
                <Input
                  placeholder="用户ID"
                  type="number"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={12}>
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

      {/* 用户表格 */}
      <Card bordered={false}>
        <Table<UserInfo>
          columns={columns}
          dataSource={userList}
          rowKey="userid"
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
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 用户详情模态框 */}
      <UserDetailModal
        visible={detailModalVisible}
        user={selectedUser}
        onClose={() => setDetailModalVisible(false)}
      />

      {/* 用户编辑模态框 */}
      <UserEditModal
        visible={editModalVisible}
        user={selectedUser}
        onClose={() => setEditModalVisible(false)}
        onSuccess={() => {
          setEditModalVisible(false);
          handleSearch(); // 刷新列表
        }}
      />
    </div>
  );
};

export default UserManagement;