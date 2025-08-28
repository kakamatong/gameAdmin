/**
 * 对局日志查询页面
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Tag, Button, Space, Tooltip, message } from 'antd';
import { EyeOutlined, ReloadOutlined, TrophyOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/store';
import { getGameLogsAsync, clearError } from '@/store/slices/logSlice';
import type { GameLogItem, LogQueryParams } from '@/types/log';
import LogSearchForm from './components/LogSearchForm';
import type { LogSearchParams } from './components/LogSearchForm';
import LogDetailModal from './components/LogDetailModal';
import './GameLogsPage.less';

const { Title, Text } = Typography;

const GameLogsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { gameLogs, loading, error } = useAppSelector(state => state.log);
  
  const [searchParams, setSearchParams] = useState<LogQueryParams>({
    page: 1,
    pageSize: 20,
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<GameLogItem | null>(null);
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
      await dispatch(getGameLogsAsync(queryParams)).unwrap();
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
  const handleViewDetail = (record: GameLogItem) => {
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

  // 获取对局结果
  const getGameResult = (result: number) => {
    const configs = {
      0: { text: '无', color: 'default' },
      1: { text: '胜利', color: 'success' },
      2: { text: '失败', color: 'error' },
      3: { text: '平局', color: 'warning' },
      4: { text: '逃跑', color: 'red' },
    };
    
    const config = configs[result as keyof typeof configs] || configs[0];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取财富显示
  const getScoreDisplay = (score1: number, score2: number, score3: number, score4: number, score5: number) => {
    const totalScore = score1 + score2 + score3 + score4 + score5;
    if (totalScore > 0) {
      return <Text type="success">+{totalScore.toLocaleString()}</Text>;
    } else if (totalScore < 0) {
      return <Text type="danger">{totalScore.toLocaleString()}</Text>;
    } else {
      return <Text>0</Text>;
    }
  };

  // 表格列定义
  const columns: ColumnsType<GameLogItem> = [
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
      title: '游戏ID',
      dataIndex: 'gameid',
      key: 'gameid',
      width: 100,
    },
    {
      title: '房间ID',
      dataIndex: 'roomid',
      key: 'roomid',
      width: 120,
    },
    {
      title: '计分类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '对局结果',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      render: (result: number) => getGameResult(result),
    },
    {
      title: '财富变化',
      key: 'scoreChange',
      width: 120,
      render: (_, record) => getScoreDisplay(record.score1, record.score2, record.score3, record.score4, record.score5),
    },
    {
      title: '发生时间',
      dataIndex: 'time',
      key: 'time',
      width: 140,
      render: (time: string) => formatTime(time),
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
    <div className="game-logs-page">
      <div className="page-header">
        <Title level={3}>
          <TrophyOutlined /> 对局日志查询
        </Title>
      </div>

      <LogSearchForm
        title="搜索条件"
        onSearch={handleSearch}
        onReset={handleReset}
        loading={loading}
      />

      <Card 
        title="对局日志列表" 
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
          dataSource={gameLogs.data}
          rowKey="id"
          loading={loading}
          pagination={{
            current: gameLogs.page,
            pageSize: gameLogs.pageSize,
            total: gameLogs.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: handleTableChange,
          }}
          scroll={{ x: 1400 }}
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
        logType="game"
      />
    </div>
  );
};

export default GameLogsPage;