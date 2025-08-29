/**
 * 邮件详情模态框
 */

import React from 'react';
import { Modal, Descriptions, Tag, Space, Typography, Card } from 'antd';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import type { UserMailItem } from '@/types';
import { getMailTypeText, getUserMailStatusText } from '@/types/enums';

const { Text, Paragraph } = Typography;

interface MailDetailModalProps {
  visible: boolean;
  mail: UserMailItem | null;
  onClose: () => void;
}

const MailDetailModal: React.FC<MailDetailModalProps> = ({
  visible,
  mail,
  onClose,
}) => {
  if (!mail) return null;

  // 格式化时间
  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString();
  };

  // 获取邮件类型标签
  const getTypeTag = (type: number) => {
    const typeText = getMailTypeText(type);
    const color = type === 0 ? 'blue' : 'green';
    return <Tag color={color}>{typeText}</Tag>;
  };

  // 获取状态标签
  const getStatusTag = (status: number) => {
    const statusText = getUserMailStatusText(status);
    let color = 'default';
    if (status === 0) color = 'red';         // 未读
    else if (status === 1) color = 'orange'; // 已读
    else if (status === 2) color = 'green';  // 已领取
    else if (status === 3) color = 'gray';   // 已删除
    return <Tag color={color}>{statusText}</Tag>;
  };

  // 获取有效期状态
  const getValidityStatus = () => {
    const now = new Date();
    const startTime = new Date(mail.startTime);
    const endTime = new Date(mail.endTime);
    
    if (now < startTime) {
      return <Tag color="orange">未开始</Tag>;
    } else if (now >= startTime && now <= endTime) {
      return <Tag color="green">进行中</Tag>;
    } else {
      return <Tag color="red">已过期</Tag>;
    }
  };

  // 解析奖励信息
  const parseAwards = () => {
    if (!mail.awards) return <Text type="secondary">无奖励</Text>;
    
    try {
      const awardData = JSON.parse(mail.awards);
      const props = awardData.props || [];
      
      if (!Array.isArray(props) || props.length === 0) {
        return <Text type="secondary">无奖励</Text>;
      }

      const awardTypeMap: Record<number, string> = {
        1: '钻石',
        2: '金币',
        3: '门票',
        4: '体力',
        5: 'VIP经验',
        6: '道具',
      };

      return (
        <Space direction="vertical" size={4}>
          {props.map((award: any, index: number) => (
            <div key={index}>
              <Text strong>{awardTypeMap[award.id] || `类型${award.id}`}:</Text>
              <Text style={{ marginLeft: 8 }}>{award.cnt?.toLocaleString() || 0}</Text>
            </div>
          ))}
        </Space>
      );
    } catch (error) {
      return <Text type="danger">奖励数据格式错误</Text>;
    }
  };

  return (
    <Modal
      title={
        <Space>
          <MailOutlined />
          <span>邮件详情 - {mail.title}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="mail-detail-modal"
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="邮件ID" span={1}>
          {mail.id}
        </Descriptions.Item>
        <Descriptions.Item label="用户ID" span={1}>
          <Space>
            <UserOutlined />
            <span>{mail.userid}</span>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="邮件类型" span={1}>
          {getTypeTag(mail.type)}
        </Descriptions.Item>
        <Descriptions.Item label="邮件状态" span={1}>
          {getStatusTag(mail.status)}
        </Descriptions.Item>

        <Descriptions.Item label="邮件标题" span={2}>
          {mail.title}
        </Descriptions.Item>

        <Descriptions.Item label="邮件内容" span={2}>
          <Card size="small" style={{ backgroundColor: '#fafafa' }}>
            <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {mail.content}
            </Paragraph>
          </Card>
        </Descriptions.Item>

        <Descriptions.Item label="奖励信息" span={2}>
          <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
            {parseAwards()}
          </Card>
        </Descriptions.Item>

        <Descriptions.Item label="开始时间" span={1}>
          {formatTime(mail.startTime)}
        </Descriptions.Item>
        <Descriptions.Item label="结束时间" span={1}>
          {formatTime(mail.endTime)}
        </Descriptions.Item>

        <Descriptions.Item label="有效期状态" span={1}>
          {getValidityStatus()}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间" span={1}>
          {formatTime(mail.createdAt)}
        </Descriptions.Item>

        <Descriptions.Item label="更新时间" span={2}>
          {formatTime(mail.updateAt)}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 16 }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          注意：邮件的生效时间基于服务器时间，请确保时间设置正确。
        </Text>
      </div>
    </Modal>
  );
};

export default MailDetailModal;