/**
 * 用户编辑模态框
 */

import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Card,
  Row,
  Col,
  Space,
  Button,
  DatePicker,
} from 'antd';
import { useAppDispatch } from '@/store';
import { updateUserAsync } from '@/store/slices/userSlice';
import { useMessage } from '@/utils/message';
import { Gender, getGenderText } from '@/types/enums';
import type { UserInfo, UserUpdateRequest, UserRich } from '@/types';
import dayjs from 'dayjs';

const { Option } = Select;

interface UserEditModalProps {
  visible: boolean;
  user: UserInfo | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  nickname: string;
  sex: number;
  province: string;
  city: string;
  status: number;
  riches: UserRich[];
  createTime: dayjs.Dayjs;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  visible,
  user,
  onClose,
  onSuccess,
}) => {
  const message = useMessage();
  const [form] = Form.useForm<FormValues>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(false);

  // 初始化表单数据
  useEffect(() => {
    if (visible && user) {
      console.log('初始化表单数据:', user);
      form.setFieldsValue({
        nickname: user.nickname || '',
        sex: user.sex ?? 0,
        province: user.province || '',
        city: user.city || '',
        status: user.status,
        riches: user.riches || [],
        createTime: user.createTime ? dayjs(user.createTime) : dayjs(),
      });
    } else if (!visible) {
      // 关闭模态框时重置表单
      form.resetFields();
    }
  }, [visible, user, form]);

  // 处理表单提交
  const handleSubmit = async (values: FormValues) => {
    if (!user) return;

    setLoading(true);
    try {
      const updateData: UserUpdateRequest = {
        nickname: values.nickname !== user.nickname ? values.nickname : undefined,
        sex: values.sex !== user.sex ? values.sex : undefined,
        province: values.province !== user.province ? values.province : undefined,
        city: values.city !== user.city ? values.city : undefined,
        status: values.status !== user.status ? values.status : undefined,
        riches: JSON.stringify(values.riches) !== JSON.stringify(user.riches) 
          ? values.riches 
          : undefined,
        createTime: values.createTime.toISOString() !== user.createTime 
          ? values.createTime.toISOString() 
          : undefined,
      };

      // 过滤掉undefined的字段
      const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([, value]) => value !== undefined)
      ) as UserUpdateRequest;

      if (Object.keys(filteredData).length === 0) {
        message.warning('没有需要更新的数据');
        return;
      }

      console.log('更新用户数据:', filteredData);
      await dispatch(updateUserAsync({ 
        userId: user.userid, 
        data: filteredData 
      })).unwrap();

      message.success('用户信息更新成功');
      onSuccess();
    } catch (error: any) {
      message.error(error.message || '更新用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  if (!user) return null;

  return (
    <Modal
      title={`编辑用户 - ${user.nickname || `用户${user.userid}`}`}
      open={visible}
      onCancel={handleCancel}
      width={700}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        preserve={false}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="昵称"
              name="nickname"
              rules={[
                { required: true, message: '请输入昵称' },
                { max: 50, message: '昵称不能超过50个字符' },
              ]}
            >
              <Input placeholder="请输入用户昵称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="性别"
              name="sex"
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Select placeholder="请选择性别">
                <Option value={Gender.UNKNOWN}>{getGenderText(Gender.UNKNOWN)}</Option>
                <Option value={Gender.MALE}>{getGenderText(Gender.MALE)}</Option>
                <Option value={Gender.FEMALE}>{getGenderText(Gender.FEMALE)}</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="省份"
              name="province"
              rules={[
                { max: 50, message: '省份名称不能超过50个字符' },
              ]}
            >
              <Input placeholder="请输入省份" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="城市"
              name="city"
              rules={[
                { max: 50, message: '城市名称不能超过50个字符' },
              ]}
            >
              <Input placeholder="请输入城市" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="状态"
              name="status"
              rules={[{ required: true, message: '请选择用户状态' }]}
            >
              <Select placeholder="请选择用户状态">
                <Option value={1}>正常</Option>
                <Option value={0}>禁用</Option>
                <Option value={2}>封禁</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="注册时间"
              name="createTime"
              rules={[{ required: true, message: '请选择注册时间' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                showTime={{ format: 'HH:mm:ss' }}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择注册时间"
              />
            </Form.Item>
          </Col>
        </Row>

        <Card title="财富信息" size="small">
          <Form.List name="riches">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={16} align="middle">
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'richType']}
                        label="财富类型"
                        rules={[{ required: true, message: '请选择财富类型' }]}
                      >
                        <Select placeholder="财富类型">
                          <Option value={1}>钻石</Option>
                          <Option value={2}>金币</Option>
                          <Option value={3}>门票</Option>
                          <Option value={4}>体力</Option>
                          <Option value={5}>VIP经验</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'richNums']}
                        label="数量"
                        rules={[
                          { required: true, message: '请输入数量' },
                          { type: 'number', min: 0, message: '数量不能为负数' },
                        ]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="请输入数量"
                          min={0}
                          precision={0}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Button
                        type="link"
                        danger
                        onClick={() => remove(name)}
                        style={{ marginTop: 30 }}
                      >
                        删除
                      </Button>
                    </Col>
                  </Row>
                ))}
                
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ richType: 1, richNums: 0 })}
                    block
                  >
                    添加财富类型
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        {/* 表单按钮区域 - 移到Form内部 */}
        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>
              取消
            </Button>
            <Button 
              type="primary" 
              loading={loading}
              htmlType="submit"
            >
              保存
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserEditModal;