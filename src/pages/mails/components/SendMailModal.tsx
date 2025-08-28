/**
 * 发送邮件模态框
 */

import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Card,
  Row,
  Col,
  InputNumber,
  Button,
  Space,
  message,
  Typography,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/store';
import { sendMailAsync } from '@/store/slices/mailSlice';
import type { SendMailRequest, MailAwardItem } from '@/types';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface SendMailModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  type: number;
  title: string;
  content: string;
  awards: MailAwardItem[];
  timeRange: [dayjs.Dayjs, dayjs.Dayjs];
  targetUsers: string;
}

const SendMailModal: React.FC<SendMailModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<FormValues>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  // 奖励类型选项
  const awardTypeOptions = [
    { label: '钻石', value: 1 },
    { label: '金币', value: 2 },
    { label: '门票', value: 3 },
    { label: '体力', value: 4 },
    { label: '道具', value: 5 },
    { label: 'VIP经验', value: 6 },
  ];

  // 处理表单提交
  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      // 处理目标用户ID列表
      let targetUsers: number[] = [];
      if (values.type === 1 && values.targetUsers) {
        const userIdStrings = values.targetUsers.split(/[,，\s]+/).filter(Boolean);
        targetUsers = userIdStrings.map(id => {
          const num = parseInt(id.trim(), 10);
          if (isNaN(num)) {
            throw new Error(`无效的用户ID: ${id}`);
          }
          return num;
        });
      }

      // 处理奖励数据
      const awards = values.awards?.filter(award => award.type && award.count > 0) || [];

      const sendData: SendMailRequest = {
        type: values.type,
        title: values.title,
        content: values.content,
        awards: JSON.stringify(awards),
        startTime: values.timeRange[0].toISOString(),
        endTime: values.timeRange[1].toISOString(),
        targetUsers,
      };

      await dispatch(sendMailAsync(sendData)).unwrap();
      
      message.success('邮件发送成功');
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      message.error(error.message || '发送邮件失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // 监听邮件类型变化
  const handleTypeChange = (type: number) => {
    if (type === 0) {
      // 全服邮件时清空目标用户
      form.setFieldValue('targetUsers', '');
    }
  };

  return (
    <Modal
      title="发送邮件"
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
          发送邮件
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        preserve={false}
        initialValues={{
          type: 0,
          awards: [],
          timeRange: [dayjs(), dayjs().add(30, 'day')],
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="邮件类型"
              name="type"
              rules={[{ required: true, message: '请选择邮件类型' }]}
            >
              <Select onChange={handleTypeChange}>
                <Option value={0}>全服邮件</Option>
                <Option value={1}>个人邮件</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="有效期"
              name="timeRange"
              rules={[{ required: true, message: '请选择邮件有效期' }]}
            >
              <RangePicker
                style={{ width: '100%' }}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="邮件标题"
          name="title"
          rules={[
            { required: true, message: '请输入邮件标题' },
            { max: 100, message: '标题不能超过100个字符' },
          ]}
        >
          <Input placeholder="请输入邮件标题" />
        </Form.Item>

        <Form.Item
          label="邮件内容"
          name="content"
          rules={[
            { required: true, message: '请输入邮件内容' },
            { max: 1000, message: '内容不能超过1000个字符' },
          ]}
        >
          <TextArea
            placeholder="请输入邮件内容"
            rows={4}
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
        >
          {({ getFieldValue }) => {
            const mailType = getFieldValue('type');
            return mailType === 1 ? (
              <Form.Item
                label="目标用户"
                name="targetUsers"
                rules={[
                  { required: true, message: '请输入目标用户ID' },
                ]}
                extra="多个用户ID请用逗号分隔，例如：123,456,789"
              >
                <TextArea
                  placeholder="请输入目标用户ID，多个ID用逗号分隔"
                  rows={2}
                />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>

        <Card title="奖励配置" size="small">
          <Form.List name="awards">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={16} align="middle">
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'type']}
                        label="奖励类型"
                        rules={[{ required: true, message: '请选择奖励类型' }]}
                      >
                        <Select placeholder="奖励类型">
                          {awardTypeOptions.map(option => (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'count']}
                        label="数量"
                        rules={[
                          { required: true, message: '请输入数量' },
                          { type: 'number', min: 1, message: '数量必须大于0' },
                        ]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="请输入数量"
                          min={1}
                          precision={0}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(name)}
                        style={{ color: '#ff4d4f', fontSize: '16px', marginTop: '30px' }}
                      />
                    </Col>
                  </Row>
                ))}
                
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ type: 1, count: 1 })}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加奖励
                  </Button>
                </Form.Item>
                
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => 
                    prevValues.awards !== currentValues.awards
                  }
                >
                  {({ getFieldValue }) => {
                    const awards = getFieldValue('awards');
                    return (!awards || awards.length === 0) ? (
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        如果不添加奖励，将发送纯文本邮件
                      </Text>
                    ) : null;
                  }}
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>
      </Form>
    </Modal>
  );
};

export default SendMailModal;