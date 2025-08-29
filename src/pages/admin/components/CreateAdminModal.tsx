/**
 * 创建管理员模态框
 */

import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Row,
  Col,
  Button,
  Typography,
} from 'antd';
import { useAppDispatch } from '@/store';
import { createAdminAsync } from '@/store/slices/adminSlice';
import { useMessage } from '@/utils/message';
import type { CreateAdminRequest } from '@/types/admin';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

interface CreateAdminModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  mobile?: string;
  realName: string;
  isSuperAdmin: boolean;
  departmentId?: number;
  note?: string;
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const message = useMessage();
  const [form] = Form.useForm<FormValues>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  // 处理表单提交
  const handleSubmit = async (values: FormValues) => {
    console.log('👤 创建管理员 - 原始表单数据:', values);
    
    setLoading(true);
    try {
      // 构建请求数据，排除确认密码字段
      const { confirmPassword, ...createData } = values;
      const requestData: CreateAdminRequest = createData;

      console.log('👤 最终发送到API的参数:', requestData);
      console.log('👤 参数详细信息:');
      console.log('  - 用户名:', requestData.username);
      console.log('  - 邮箱:', requestData.email);
      console.log('  - 真实姓名:', requestData.realName);
      console.log('  - 是否超级管理员:', requestData.isSuperAdmin);
      console.log('  - 手机号:', requestData.mobile || '未填写');
      console.log('  - 部门ID:', requestData.departmentId || '未设置');
      console.log('  - 备注:', requestData.note || '无');

      await dispatch(createAdminAsync(requestData)).unwrap();
      
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      message.error(error.message || '创建管理员失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // 密码确认验证
  const validateConfirmPassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请确认密码'));
    }
    const password = form.getFieldValue('password');
    if (value !== password) {
      return Promise.reject(new Error('两次输入的密码不一致'));
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title="创建管理员"
      open={visible}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={() => form.submit()}
        >
          创建管理员
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        preserve={false}
        initialValues={{
          isSuperAdmin: false,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, max: 50, message: '用户名长度为3-50个字符' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
              ]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="真实姓名"
              name="realName"
              rules={[
                { required: true, message: '请输入真实姓名' },
                { min: 1, max: 50, message: '真实姓名长度为1-50个字符' },
              ]}
            >
              <Input placeholder="请输入真实姓名" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, max: 50, message: '密码长度为6-50个字符' },
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="确认密码"
              name="confirmPassword"
              rules={[
                { required: true, message: '请确认密码' },
                { validator: validateConfirmPassword },
              ]}
            >
              <Input.Password placeholder="请再次输入密码" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
                { max: 100, message: '邮箱长度不能超过100个字符' },
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="手机号"
              name="mobile"
              rules={[
                { max: 20, message: '手机号长度不能超过20个字符' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
              ]}
            >
              <Input placeholder="请输入手机号（可选）" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="管理员类型"
              name="isSuperAdmin"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="超级管理员" 
                unCheckedChildren="普通管理员"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="部门ID"
              name="departmentId"
            >
              <Input 
                type="number" 
                placeholder="请输入部门ID（可选）"
                min={1}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="备注"
          name="note"
          rules={[
            { max: 500, message: '备注长度不能超过500个字符' },
          ]}
        >
          <TextArea
            placeholder="请输入备注信息（可选）"
            rows={3}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <div style={{ background: '#f6f6f6', padding: '12px', borderRadius: '6px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <strong>权限说明：</strong><br />
            • 超级管理员：拥有所有权限，可以管理其他管理员<br />
            • 普通管理员：基础管理权限，无法管理其他管理员
          </Text>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateAdminModal;