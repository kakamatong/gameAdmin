/**
 * 用户详情模态框
 */

import React from 'react';
import { Modal, Descriptions, Tag, Avatar, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { UserInfo } from '@/types';

const { Text } = Typography;

interface UserDetailModalProps {
  visible: boolean;
  user: UserInfo | null;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  visible,
  user,
  onClose,
}) => {
  if (!user) return null;

  // 格式化时间
  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString();
  };

  // 获取性别文本
  const getSexText = (sex: number) => {
    const sexMap = { 0: '未知', 1: '男', 2: '女' };
    return sexMap[sex as keyof typeof sexMap] || '未知';
  };

  // 获取状态标签
  const getStatusTag = (status: number) => (
    <Tag color={status === 1 ? 'green' : 'red'}>
      {status === 1 ? '正常' : '禁用'}
    </Tag>
  );

  // 获取财富信息
  const getRichesInfo = () => {
    if (!user.riches || user.riches.length === 0) {
      return <Text type="secondary">暂无财富信息</Text>;
    }

    const richTypeMap: Record<number, string> = {
      1: '钻石',
      2: '金币',
      3: '门票',
      4: '体力',
      5: 'VIP经验',
    };

    return (
      <Space direction="vertical" size={4}>
        {user.riches.map((rich, index) => (
          <div key={index}>
            <Text strong>{richTypeMap[rich.richType] || `类型${rich.richType}`}:</Text>
            <Text style={{ marginLeft: 8 }}>{rich.richNums.toLocaleString()}</Text>
          </div>
        ))}
      </Space>
    );
  };

  return (
    <Modal
      title={(
        <Space>
          <Avatar 
            size={32} 
            src={user.headurl} 
            icon={<UserOutlined />}
          />
          <span>用户详情 - {user.nickname || `用户${user.userid}`}</span>
        </Space>
      )}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="user-detail-modal"
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="用户ID" span={1}>
          {user.userid}
        </Descriptions.Item>
        <Descriptions.Item label="昵称" span={1}>
          {user.nickname || '未设置'}
        </Descriptions.Item>
        
        <Descriptions.Item label="头像" span={1}>
          <Avatar 
            size={48} 
            src={user.headurl} 
            icon={<UserOutlined />}
          />
        </Descriptions.Item>
        <Descriptions.Item label="性别" span={1}>
          {getSexText(user.sex)}
        </Descriptions.Item>

        <Descriptions.Item label="省份" span={1}>
          {user.province || '未知'}
        </Descriptions.Item>
        <Descriptions.Item label="城市" span={1}>
          {user.city || '未知'}
        </Descriptions.Item>

        <Descriptions.Item label="IP地址" span={1}>
          {user.ip || '未知'}
        </Descriptions.Item>
        <Descriptions.Item label="状态" span={1}>
          {getStatusTag(user.status)}
        </Descriptions.Item>

        <Descriptions.Item label="游戏ID" span={1}>
          {user.gameid || '未在游戏中'}
        </Descriptions.Item>
        <Descriptions.Item label="房间ID" span={1}>
          {user.roomid || '未在房间中'}
        </Descriptions.Item>

        <Descriptions.Item label="财富信息" span={2}>
          {getRichesInfo()}
        </Descriptions.Item>

        <Descriptions.Item label="注册时间" span={1}>
          {formatTime(user.createTime)}
        </Descriptions.Item>
        <Descriptions.Item label="更新时间" span={1}>
          {formatTime(user.updateTime)}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default UserDetailModal;