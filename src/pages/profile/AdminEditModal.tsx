/**
 * 管理员信息编辑模态框
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  message,
  Space,
  InputNumber,
} from 'antd';
import {
  UserOutlined,
  UploadOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { adminService } from '@/services/adminService';
import { getSafeAvatarProps } from '@/utils/react19Compatibility';
import type { AdminInfo, AdminUpdateRequest } from '@/types/admin';

const { TextArea } = Input;

interface AdminEditModalProps {
  visible: boolean;
  adminInfo: AdminInfo;
  onCancel: () => void;
  onSuccess: () => void;
}

const AdminEditModal: React.FC<AdminEditModalProps> = ({
  visible,
  adminInfo,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  useEffect(() => {
    if (visible && adminInfo) {
      // 当模态框打开时，初始化表单数据
      form.setFieldsValue({
        email: adminInfo.email,
        mobile: adminInfo.mobile,
        realName: adminInfo.realName,
        departmentId: adminInfo.departmentId,
        note: adminInfo.note,
      });
      setAvatarUrl(adminInfo.avatar);
    }
  }, [visible, adminInfo, form]);

  // 处理表单提交
  const handleSubmit = async (values: AdminUpdateRequest) => {
    setLoading(true);
    try {
      const updateData: AdminUpdateRequest = {
        ...values,
        avatar: avatarUrl,
      };

      // 移除空值字段
      Object.keys(updateData).forEach(key => {
        const value = updateData[key as keyof AdminUpdateRequest];
        if (value === '' || value === undefined || value === null) {
          delete updateData[key as keyof AdminUpdateRequest];
        }
      });

      await adminService.updateAdminInfo(adminInfo.id, updateData);
      onSuccess();
    } catch (error: any) {
      console.error('更新管理员信息失败:', error);
      message.error(error.message || '更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理头像上传
  const handleAvatarChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // 假设上传成功后返回图片URL
      const url = info.file.response?.url || info.file.response?.data?.url;
      if (url) {
        setAvatarUrl(url);
        message.success('头像上传成功');
      } else {
        message.error('头像上传失败');
      }
    }
    if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  // 上传前的验证
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!');
      return false;
    }
    return true;
  };

  // 手动上传头像URL
  const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarUrl(e.target.value);
  };

  return (
    <Modal
      title="编辑个人信息"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* 头像上传区域 */}
        <Form.Item label="头像">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar
              size={64}
              icon={<UserOutlined />}
              {...getSafeAvatarProps(avatarUrl)}
            />
            <Space direction="vertical" style={{ flex: 1 }}>
              <Upload
                name="avatar"
                listType="text"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleAvatarChange}
                action="/api/upload/avatar" // 根据实际上传接口调整
              >
                <Button icon={<UploadOutlined />} size="small">
                  上传头像
                </Button>
              </Upload>
              <Input
                placeholder="或输入头像URL"
                value={avatarUrl}
                onChange={handleAvatarUrlChange}
                size="small"
              />
            </Space>
          </div>
        </Form.Item>

        {/* 基本信息 */}
        <Form.Item
          label="真实姓名"
          name="realName"
          rules={[
            { required: true, message: '请输入真实姓名' },
            { max: 50, message: '姓名长度不能超过50个字符' },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入真实姓名"
          />
        </Form.Item>

        <Form.Item
          label="邮箱地址"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入有效的邮箱地址' },
            { max: 100, message: '邮箱长度不能超过100个字符' },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="请输入邮箱地址"
          />
        </Form.Item>

        <Form.Item
          label="手机号码"
          name="mobile"
          rules={[
            { max: 20, message: '手机号长度不能超过20个字符' },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="请输入手机号码"
          />
        </Form.Item>

        <Form.Item
          label="部门ID"
          name="departmentId"
        >
          <InputNumber
            prefix={<TeamOutlined />}
            placeholder="请输入部门ID"
            style={{ width: '100%' }}
            min={1}
          />
        </Form.Item>

        <Form.Item
          label="备注信息"
          name="note"
          rules={[
            { max: 500, message: '备注长度不能超过500个字符' },
          ]}
        >
          <TextArea
            placeholder="请输入备注信息"
            rows={3}
            showCount
            maxLength={500}
          />
        </Form.Item>

        {/* 表单操作按钮 */}
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              保存
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AdminEditModal;