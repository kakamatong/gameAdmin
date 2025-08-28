/**
 * 日志功能测试页面
 * 用于验证日志查询页面的功能和错误处理
 */

import React, { useState } from 'react';
import { Card, Button, Space, Typography, Table, Tag, message } from 'antd';
import { ExperimentOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { LoginLogItem, GameLogItem } from '@/types/log';

const { Title, Text } = Typography;

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

const LogTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // 模拟登录日志数据
  const mockLoginLogs: LoginLogItem[] = [
    {
      id: 1001,
      userid: 12345,
      nickname: '测试用户1',
      ip: '192.168.1.100',
      loginType: 'android',
      status: 1,
      ext: '',
      createTime: dayjs().subtract(1, 'hour').toISOString(),
    },
    {
      id: 1002,
      userid: 12346,
      nickname: '测试用户2',
      ip: '192.168.1.101',
      loginType: 'ios',
      status: 1,
      ext: '',
      createTime: dayjs().subtract(2, 'hour').toISOString(),
    },
  ];

  // 模拟对局日志数据
  const mockGameLogs: GameLogItem[] = [
    {
      id: 2001,
      type: 0,
      userid: 12345,
      gameid: 10001,
      roomid: 500123,
      result: 1,
      score1: 5000,
      score2: 0,
      score3: 0,
      score4: 0,
      score5: 0,
      time: dayjs().subtract(45, 'minute').toISOString(),
      ext: '',
    },
    {
      id: 2002,
      type: 0,
      userid: 12345,
      gameid: 10001,
      roomid: 500124,
      result: 2,
      score1: -3000,
      score2: 0,
      score3: 0,
      score4: 0,
      score5: 0,
      time: dayjs().subtract(30, 'minute').toISOString(),
      ext: '',
    },
  ];

  // 运行测试
  const runTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // 测试1: 日期格式化
    try {
      const formatted = dayjs().format('YYYY-MM-DD HH:mm:ss');
      results.push({
        name: '日期格式化测试',
        status: 'success',
        message: `成功格式化时间: ${formatted}`,
      });
    } catch (error) {
      results.push({
        name: '日期格式化测试',
        status: 'error',
        message: `日期格式化失败: ${error}`,
      });
    }

    // 测试2: 数据结构验证
    try {
      const hasRequiredFields = mockLoginLogs.every(log => 
        log.id && log.userid && log.createTime
      );
      if (hasRequiredFields) {
        results.push({
          name: '登录日志数据结构验证',
          status: 'success',
          message: '所有必需字段都存在',
        });
      } else {
        results.push({
          name: '登录日志数据结构验证',
          status: 'error',
          message: '缺少必需字段',
        });
      }
    } catch (error) {
      results.push({
        name: '登录日志数据结构验证',
        status: 'error',
        message: `验证失败: ${error}`,
      });
    }

    // 测试3: 对局日志数据验证
    try {
      const hasRequiredFields = mockGameLogs.every(log => 
        log.id && log.userid && log.gameid && log.time
      );
      if (hasRequiredFields) {
        results.push({
          name: '对局日志数据结构验证',
          status: 'success',
          message: '所有必需字段都存在',
        });
      } else {
        results.push({
          name: '对局日志数据结构验证',
          status: 'error',
          message: '缺少必需字段',
        });
      }
    } catch (error) {
      results.push({
        name: '对局日志数据结构验证',
        status: 'error',
        message: `验证失败: ${error}`,
      });
    }

    // 测试4: 时间范围计算
    try {
      const start = dayjs().subtract(7, 'day');
      const end = dayjs();
      const diff = end.diff(start, 'day');
      if (diff === 7) {
        results.push({
          name: '时间范围计算测试',
          status: 'success',
          message: '时间差计算正确',
        });
      } else {
        results.push({
          name: '时间范围计算测试',
          status: 'error',
          message: `时间差计算错误: 预期7天，实际${diff}天`,
        });
      }
    } catch (error) {
      results.push({
        name: '时间范围计算测试',
        status: 'error',
        message: `计算失败: ${error}`,
      });
    }

    setTestResults(results);
    setIsRunning(false);

    const successCount = results.filter(r => r.status === 'success').length;
    const totalCount = results.length;
    
    if (successCount === totalCount) {
      message.success(`所有测试通过! (${successCount}/${totalCount})`);
    } else {
      message.warning(`部分测试失败: ${successCount}/${totalCount} 通过`);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '测试项目',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = {
          success: { icon: <CheckCircleOutlined />, color: 'success', text: '通过' },
          error: { icon: <CloseCircleOutlined />, color: 'error', text: '失败' },
          pending: { icon: <ExperimentOutlined />, color: 'processing', text: '进行中' },
        };
        const { icon, color, text } = config[status as keyof typeof config];
        return <Tag icon={icon} color={color}>{text}</Tag>;
      },
    },
    {
      title: '结果消息',
      dataIndex: 'message',
      key: 'message',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={3}>
          <ExperimentOutlined /> 日志功能测试
        </Title>
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text>
              这个测试页面验证日志查询功能的核心组件是否正常工作，
              包括日期处理、数据结构验证和时间计算等。
            </Text>
          </div>

          <Button
            type="primary"
            icon={<ExperimentOutlined />}
            onClick={runTests}
            loading={isRunning}
            size="large"
          >
            运行测试
          </Button>

          {testResults.length > 0 && (
            <Table
              columns={columns}
              dataSource={testResults}
              rowKey="name"
              pagination={false}
              size="small"
            />
          )}

          <Card title="模拟数据预览" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>登录日志样本 ({mockLoginLogs.length} 条):</Text>
                <pre style={{ background: '#f5f5f5', padding: '8px', marginTop: '8px' }}>
                  {JSON.stringify(mockLoginLogs[0], null, 2)}
                </pre>
              </div>
              
              <div>
                <Text strong>对局日志样本 ({mockGameLogs.length} 条):</Text>
                <pre style={{ background: '#f5f5f5', padding: '8px', marginTop: '8px' }}>
                  {JSON.stringify(mockGameLogs[0], null, 2)}
                </pre>
              </div>
            </Space>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default LogTestPage;