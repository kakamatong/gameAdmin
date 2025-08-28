/**
 * 日志查询搜索表单通用组件
 */

import React from 'react';
import { Card, Form, Row, Col, Input, DatePicker, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export interface LogSearchParams {
  userid?: number;
  startTime?: string;
  endTime?: string;
}

interface LogSearchFormProps {
  onSearch: (params: LogSearchParams) => void;
  onReset: () => void;
  loading?: boolean;
  title?: string;
}

const LogSearchForm: React.FC<LogSearchFormProps> = ({
  onSearch,
  onReset,
  loading = false,
  title = '搜索条件',
}) => {
  const [form] = Form.useForm();

  // 处理搜索
  const handleSearch = (values: any) => {
    const params: LogSearchParams = {};
    
    // 用户ID
    if (values.userid) {
      params.userid = parseInt(values.userid);
    }
    
    // 时间范围
    if (values.timeRange && values.timeRange.length === 2) {
      params.startTime = values.timeRange[0].format('YYYY-MM-DDTHH:mm:ss') + 'Z';
      params.endTime = values.timeRange[1].format('YYYY-MM-DDTHH:mm:ss') + 'Z';
    }
    
    onSearch(params);
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  // 日期范围预设
  const rangePresets: {
    label: string;
    value: [dayjs.Dayjs, dayjs.Dayjs];
  }[] = [
    { label: '今天', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
    { label: '昨天', value: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')] },
    { label: '最近3天', value: [dayjs().subtract(2, 'day').startOf('day'), dayjs().endOf('day')] },
    { label: '最近7天', value: [dayjs().subtract(6, 'day').startOf('day'), dayjs().endOf('day')] },
    { label: '最近30天', value: [dayjs().subtract(29, 'day').startOf('day'), dayjs().endOf('day')] },
  ];

  return (
    <Card title={title} className="search-form-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSearch}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              label="用户ID"
              name="userid"
              rules={[
                {
                  pattern: /^\d+$/,
                  message: '请输入有效的用户ID（数字）',
                },
              ]}
            >
              <Input
                placeholder="请输入用户ID"
                allowClear
                disabled={loading}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} md={10} lg={8}>
            <Form.Item
              label="时间范围"
              name="timeRange"
            >
              <RangePicker
                showTime={{
                  format: 'HH:mm:ss',
                }}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={['开始时间', '结束时间']}
                presets={rangePresets}
                style={{ width: '100%' }}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={24} md={6} lg={10}>
            <Form.Item label=" " style={{ marginBottom: 0 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  loading={loading}
                >
                  搜索
                </Button>
                <Button
                  type="default"
                  onClick={handleReset}
                  icon={<ReloadOutlined />}
                  disabled={loading}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default LogSearchForm;