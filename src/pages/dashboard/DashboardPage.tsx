/**
 * 控制台页面
 */

import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  FileTextOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-page">
      <Title level={2} style={{ marginBottom: 24 }}>
        控制台
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="在线用户"
              value={0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日邮件"
              value={0}
              prefix={<MailOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃邮件"
              value={0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总邮件数"
              value={0}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="系统概览" variant="borderless">
            <p>欢迎使用游戏管理后台系统！</p>
            <p>您可以通过左侧导航菜单访问各项功能：</p>
            <ul>
              <li>用户管理：查看和管理游戏用户信息</li>
              <li>日志查询：查看用户登录和对局记录</li>
              <li>邮件管理：发送和管理系统邮件</li>
              <li>管理员管理：管理后台管理员账户（仅超级管理员）</li>
            </ul>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="快捷操作" variant="borderless">
            <p>常用功能快捷入口：</p>
            <ul>
              <li><a href="/users">用户列表</a> - 查看所有用户</li>
              <li><a href="/mails">邮件管理</a> - 发送系统邮件</li>
              <li><a href="/logs/login">登录日志</a> - 查看用户登录记录</li>
              <li><a href="/logs/game">对局日志</a> - 查看游戏对局记录</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;