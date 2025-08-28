/**
 * 日志详情模态框组件
 */

import React from 'react';
import { Modal, Descriptions, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import type { LoginLogItem, GameLogItem } from '@/types/log';

const { Text } = Typography;

interface LogDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  logData: LoginLogItem | GameLogItem | null;
  logType: 'login' | 'game';
}

const LogDetailModal: React.FC<LogDetailModalProps> = ({
  visible,
  onCancel,
  logData,
  logType,
}) => {
  if (!logData) return null;

  // 格式化时间
  const formatTime = (time?: string) => {
    if (!time) return '无';
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
  };

  // 获取登录状态文本
  const getLoginStatusText = (status: number) => {
    return status === 1 ? '成功' : '失败';
  };

  // 获取登录状态颜色
  const getLoginStatusColor = (status: number) => {
    return status === 1 ? 'success' : 'error';
  };

  // 获取对局结果文本
  const getGameResultText = (result: number) => {
    switch (result) {
      case 0: return '无';
      case 1: return '胜利';
      case 2: return '失败';
      case 3: return '平局';
      case 4: return '逃跑';
      default: return '未知';
    }
  };

  // 获取对局结果颜色
  const getGameResultColor = (result: number) => {
    switch (result) {
      case 1: return 'success';
      case 2: return 'error';
      case 3: return 'warning';
      case 4: return 'red';
      default: return 'default';
    }
  };

  // 渲染登录日志详情
  const renderLoginLogDetails = (log: LoginLogItem) => (
    <Descriptions column={2} bordered>
      <Descriptions.Item label="日志ID">{log.id}</Descriptions.Item>
      <Descriptions.Item label="用户ID">{log.userid}</Descriptions.Item>
      <Descriptions.Item label="用户昵称">{log.nickname}</Descriptions.Item>
      <Descriptions.Item label="认证类型">{log.loginType}</Descriptions.Item>
      <Descriptions.Item label="IP地址">{log.ip}</Descriptions.Item>
      <Descriptions.Item label="登录状态">
        <Tag color={getLoginStatusColor(log.status)}>
          {getLoginStatusText(log.status)}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="创建时间">
        {formatTime(log.createTime)}
      </Descriptions.Item>
      <Descriptions.Item label="扩展数据" span={2}>
        <Text code>{log.ext || '无'}</Text>
      </Descriptions.Item>
    </Descriptions>
  );

  // 渲染对局日志详情
  const renderGameLogDetails = (log: GameLogItem) => (
    <Descriptions column={2} bordered>
      <Descriptions.Item label="日志ID">{log.id}</Descriptions.Item>
      <Descriptions.Item label="用户ID">{log.userid}</Descriptions.Item>
      <Descriptions.Item label="游戏ID">{log.gameid}</Descriptions.Item>
      <Descriptions.Item label="房间ID">{log.roomid}</Descriptions.Item>
      <Descriptions.Item label="计分类型">{log.type}</Descriptions.Item>
      <Descriptions.Item label="对局结果">
        <Tag color={getGameResultColor(log.result)}>
          {getGameResultText(log.result)}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="财富1">
        <Text type={log.score1 >= 0 ? 'success' : 'danger'}>
          {log.score1 >= 0 ? '+' : ''}{log.score1.toLocaleString()}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label="财富2">
        <Text type={log.score2 >= 0 ? 'success' : 'danger'}>
          {log.score2 >= 0 ? '+' : ''}{log.score2.toLocaleString()}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label="财富3">
        <Text type={log.score3 >= 0 ? 'success' : 'danger'}>
          {log.score3 >= 0 ? '+' : ''}{log.score3.toLocaleString()}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label="财富4">
        <Text type={log.score4 >= 0 ? 'success' : 'danger'}>
          {log.score4 >= 0 ? '+' : ''}{log.score4.toLocaleString()}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label="财富5">
        <Text type={log.score5 >= 0 ? 'success' : 'danger'}>
          {log.score5 >= 0 ? '+' : ''}{log.score5.toLocaleString()}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label="总财富变化">
        <Text type={(log.score1 + log.score2 + log.score3 + log.score4 + log.score5) >= 0 ? 'success' : 'danger'}>
          {(log.score1 + log.score2 + log.score3 + log.score4 + log.score5).toLocaleString()}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label="发生时间">
        {formatTime(log.time)}
      </Descriptions.Item>
      <Descriptions.Item label="扩展数据" span={2}>
        <Text code>{log.ext || '无'}</Text>
      </Descriptions.Item>
    </Descriptions>
  );

  return (
    <Modal
      title={logType === 'login' ? '登录日志详情' : '对局日志详情'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      maskClosable={false}
    >
      {logType === 'login' 
        ? renderLoginLogDetails(logData as LoginLogItem)
        : renderGameLogDetails(logData as GameLogItem)
      }
    </Modal>
  );
};

export default LogDetailModal;