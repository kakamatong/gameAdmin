/**
 * 登录页面组件
 */

import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { loginAsync } from '@/store/slices/authSlice';
import { useMessage } from '@/utils/message';
import type { AdminLoginRequest } from '@/types';
import './LoginPage.less';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [form] = Form.useForm<AdminLoginRequest>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const message = useMessage();
  
  const { loading, isAuthenticated, error } = useAppSelector(state => state.auth);

  // 如果已登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // 处理登录
  const handleLogin = async (values: AdminLoginRequest) => {
    try {
      const result = await dispatch(loginAsync(values));
      
      if (loginAsync.fulfilled.match(result)) {
        message.success('登录成功！');
        navigate('/', { replace: true });
      } else if (loginAsync.rejected.match(result)) {
        message.error(result.payload as string);
      }
    } catch (error) {
      message.error('登录失败，请重试');
    }
  };

  return (
    <div className="login-page">
      <Row justify="center" align="middle" className="login-container">
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <Card className="login-card">
            <div className="login-header">
              <Title level={2} className="login-title">
                {import.meta.env.VITE_APP_TITLE || '游戏管理后台'}
              </Title>
              <Text type="secondary">管理员登录</Text>
            </div>

            <Form
              form={form}
              name="login"
              size="large"
              onFinish={handleLogin}
              autoComplete="off"
              className="login-form"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' },
                  { max: 50, message: '用户名不能超过50个字符' },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="用户名"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' },
                  { max: 50, message: '密码不能超过50个字符' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  {loading ? '登录中...' : '登录'}
                </Button>
              </Form.Item>
            </Form>

            {error && (
              <div className="login-error">
                <Text type="danger">{error}</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;