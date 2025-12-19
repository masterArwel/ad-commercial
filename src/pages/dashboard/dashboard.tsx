import { Card, Row, Col, Statistic, Button, Space, Typography } from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  DollarCircleOutlined,
  RiseOutlined,
  PlusOutlined,
  BarChartOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

/**
 * 仪表盘页面组件
 */
export function DashboardPage() {
  // 模拟数据
  const stats = [
    {
      title: '总用户数',
      value: 11280,
      prefix: <UserOutlined />,
      suffix: '人',
      precision: 0,
    },
    {
      title: '今日订单',
      value: 1128,
      prefix: <ShoppingCartOutlined />,
      suffix: '单',
      precision: 0,
    },
    {
      title: '总收入',
      value: 112893.56,
      prefix: <DollarCircleOutlined />,
      suffix: '元',
      precision: 2,
    },
    {
      title: '增长率',
      value: 15.8,
      prefix: <RiseOutlined />,
      suffix: '%',
      precision: 1,
    },
  ];

  const handleCreateAd = () => {
    console.log('创建广告');
  };

  const handleViewReports = () => {
    console.log('查看报表');
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>仪表盘</Title>
        <Paragraph>
          欢迎使用广告投放管理系统，这里是您的数据概览。
        </Paragraph>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={stat.precision}
                valueStyle={{ color: '#3f8600' }}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 快速操作 */}
      <Card title="快速操作" style={{ marginBottom: 24 }}>
        <Space size="large">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={handleCreateAd}
          >
            创建广告
          </Button>
          <Button 
            icon={<BarChartOutlined />} 
            size="large"
            onClick={handleViewReports}
          >
            查看报表
          </Button>
          <Button 
            icon={<UserOutlined />} 
            size="large"
          >
            用户管理
          </Button>
        </Space>
      </Card>

      {/* 最近活动 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="最近活动" size="small">
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Paragraph type="secondary">暂无数据</Paragraph>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="系统通知" size="small">
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Paragraph type="secondary">暂无通知</Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;