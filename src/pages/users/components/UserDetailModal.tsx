/**
 * 用户详情模态框
 */

import React from 'react';
import { Modal, Descriptions, Tag, Avatar, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getGenderText, getUserStatusText, getRichTypeText, RichType } from '@/types/enums';
import { getSafeAvatarProps } from '@/utils/react19Compatibility';
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

  // 获取状态标签
  const getStatusTag = (status: number) => {
    const statusText = getUserStatusText(status);
    const color = status === 1 ? 'green' : status === 2 ? 'red' : 'gray';
    return <Tag color={color}>{statusText}</Tag>;
  };

  // 获取财富信息
  const getRichesInfo = () => {
    if (!user.riches || user.riches.length === 0) {
      return <Text type="secondary">暂无财富信息</Text>;
    }

    return (
      <Space direction="vertical" size={4}>
        {user.riches.map((rich, index) => (
          <div key={index}>
            <Text strong>{getRichTypeText(rich.richType)}:</Text>
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
            {...getSafeAvatarProps(user.headurl)}
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
            {...getSafeAvatarProps(user.headurl)}
            icon={<UserOutlined />}
          />
        </Descriptions.Item>
        <Descriptions.Item label="性别" span={1}>
          {getGenderText(user.sex)}
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