/**
 * 登录日志查询页面
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Tag, Button, Space, Tooltip, message } from 'antd';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/store';
import { getLoginLogsAsync, clearError } from '@/store/slices/logSlice';
import type { LoginLogItem, LogQueryParams } from '@/types/log';
import LogSearchForm from './components/LogSearchForm';
import type { LogSearchParams } from './components/LogSearchForm';
import LogDetailModal from './components/LogDetailModal';
import './LoginLogsPage.less';

const { Title } = Typography;

const LoginLogsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loginLogs, loading, error } = useAppSelector(state => state.log);
  
  const [searchParams, setSearchParams] = useState<LogQueryParams>({
    page: 1,
    pageSize: 20,
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LoginLogItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // 错误处理
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // 搜索日志
  const handleSearch = async (params: LogSearchParams & { page?: number; pageSize?: number }) => {
    const queryParams: LogQueryParams = {
      ...searchParams,
      ...params,
    };
    
    setSearchParams(queryParams);
    setHasSearched(true);
    
    try {
      await dispatch(getLoginLogsAsync(queryParams)).unwrap();
    } catch (error) {
      // 错误已在useEffect中处理
    }
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({ page: 1, pageSize: 20 });
    setHasSearched(false);
  };

  // 刷新数据
  const handleRefresh = () => {
    if (hasSearched) {
      handleSearch(searchParams);
    }
  };

  // 查看详情
  const handleViewDetail = (record: LoginLogItem) => {
    setSelectedLog(record);
    setDetailModalVisible(true);
  };

  // 分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    handleSearch({ page, pageSize });
  };

  // 格式化时间
  const formatTime = (time?: string) => {
    if (!time) return '-';
    return dayjs(time).format('MM-DD HH:mm:ss');
  };

  // 获取登录状态
  const getLoginStatus = (status: number) => {
    const isSuccess = status === 1;
    return (
      <Tag color={isSuccess ? 'success' : 'error'}>
        {isSuccess ? '成功' : '失败'}
      </Tag>
    );
  };

  // 表格列定义
  const columns: ColumnsType<LoginLogItem> = [
    {
      title: '日志ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '用户ID',
      dataIndex: 'userid',
      key: 'userid',
      width: 100,
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 120,
      ellipsis: true,
    },
    {
      title: '认证类型',
      dataIndex: 'loginType',
      key: 'loginType',
      width: 100,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 120,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 140,
      render: (time: string) => formatTime(time),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => getLoginStatus(status),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div className="login-logs-page">
      <div className="page-header">
        <Title level={3}>登录日志查询</Title>
      </div>

      <LogSearchForm
        title="搜索条件"
        onSearch={handleSearch}
        onReset={handleReset}
        loading={loading}
      />

      <Card 
        title="登录日志列表" 
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              disabled={!hasSearched}
            >
              刷新
            </Button>
          </Space>
        }
        className="logs-table-card"
      >
        <Table
          columns={columns}
          dataSource={loginLogs.data}
          rowKey="id"
          loading={loading}
          pagination={{
            current: loginLogs.page,
            pageSize: loginLogs.pageSize,
            total: loginLogs.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: handleTableChange,
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      <LogDetailModal
        visible={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedLog(null);
        }}
        logData={selectedLog}
        logType="login"
      />
    </div>
  );
};

export default LoginLogsPage;