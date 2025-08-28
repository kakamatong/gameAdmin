/**
 * 个人信息页面
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Descriptions,
  Avatar,
  Button,
  Space,
  Tag,
  Typography,
  message,
  Spin,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { adminService } from '@/services/adminService';
import { setAdminInfo } from '@/store/slices/authSlice';
import { getSafeAvatarProps } from '@/utils/react19Compatibility';
import { AdminStatus } from '@/types/enums';
import type { AdminInfo } from '@/types/admin';
import AdminEditModal from './AdminEditModal';
import './ProfilePage.less';

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { adminInfo } = useAppSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentAdminInfo, setCurrentAdminInfo] = useState<AdminInfo | null>(null);

  // 获取管理员详细信息
  const fetchAdminInfo = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAdminInfo();
      setCurrentAdminInfo(data);
      // 同时更新Redux中的管理员信息
      dispatch(setAdminInfo(data));
    } catch (error) {
      console.error('获取管理员信息失败:', error);
      message.error('获取个人信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  // 格式化时间
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '未知';
    return new Date(timeStr).toLocaleString('zh-CN');
  };

  // 获取状态标签
  const getStatusTag = (status: number) => {
    const color = status === AdminStatus.ACTIVE ? 'green' : 
                  status === AdminStatus.LOCKED ? 'red' : 'gray';
    const text = status === AdminStatus.ACTIVE ? '正常' : 
                 status === AdminStatus.LOCKED ? '锁定' : '未激活';
    return <Tag color={color}>{text}</Tag>;
  };

  // 处理编辑成功
  const handleEditSuccess = () => {
    setEditModalVisible(false);
    fetchAdminInfo(); // 重新获取最新信息
    message.success('个人信息更新成功');
  };

  if (loading && !currentAdminInfo) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  const adminData = currentAdminInfo || adminInfo;

  if (!adminData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text type="secondary">无法获取个人信息</Text>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Title level={2}>个人信息</Title>

      {/* 基本信息卡片 */}
      <Card className="profile-card" loading={loading}>
        <div className="profile-header">
          <Avatar
            size={80}
            icon={<UserOutlined />}
            {...getSafeAvatarProps(adminData.avatar)}
            className="profile-avatar"
          />
          <div className="profile-basic">
            <div className="profile-name">
              <Title level={3} style={{ margin: 0 }}>
                {adminData.realName}
              </Title>
              <Text type="secondary" className="username">
                @{adminData.username}
              </Text>
            </div>
            <div className="profile-badges">
              <Space>
                {getStatusTag(adminData.status)}
                <Tag color={adminData.isSuperAdmin ? 'gold' : 'blue'}>
                  {adminData.isSuperAdmin ? '超级管理员' : '普通管理员'}
                </Tag>
              </Space>
            </div>
          </div>
          <div className="profile-actions">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setEditModalVisible(true)}
            >
              编辑信息
            </Button>
          </div>
        </div>
      </Card>

      {/* 详细信息 */}
      <Card title="详细信息" className="profile-details">
        <Descriptions column={2} bordered>
          <Descriptions.Item 
            label={<><MailOutlined /> 邮箱地址</>} 
            span={1}
          >
            {adminData.email}
          </Descriptions.Item>
          <Descriptions.Item 
            label={<><PhoneOutlined /> 手机号码</>} 
            span={1}
          >
            {adminData.mobile || '未设置'}
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={<><TeamOutlined /> 部门ID</>} 
            span={1}
          >
            {adminData.departmentId || '未分配'}
          </Descriptions.Item>
          <Descriptions.Item 
            label="账户状态" 
            span={1}
          >
            {getStatusTag(adminData.status)}
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={<><InfoCircleOutlined /> 备注信息</>} 
            span={2}
          >
            {adminData.note || '无'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 登录信息 */}
      <Card title="登录记录" className="profile-login">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="最后登录时间" span={1}>
            {formatTime(adminData.lastLoginTime)}
          </Descriptions.Item>
          <Descriptions.Item label="最后登录IP" span={1}>
            {adminData.lastLoginIp || '未知'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 账户历史 */}
      <Card title="账户历史" className="profile-history">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="创建时间" span={1}>
            {formatTime(adminData.createdTime)}
          </Descriptions.Item>
          <Descriptions.Item label="最后更新" span={1}>
            {formatTime(adminData.updatedTime)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 编辑模态框 */}
      <AdminEditModal
        visible={editModalVisible}
        adminInfo={adminData}
        onCancel={() => setEditModalVisible(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default ProfilePage;