// 流量分析页面组件
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import PageTemplate from '@/components/PageTemplate';

// const { Title } = Typography;

/**
 * 流量分析页面
 */
export function FlowAnalysisPage() {
  return (
    <PageTemplate 
      title="流量分析" 
      description="分析广告投放的流量效果和转化数据"
    >
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日流量"
              value={11280}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="PV"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="独立访客"
              value={9320}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="UV"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="转化率"
              value={3.52}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="跳出率"
              value={45.6}
              precision={1}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="流量趋势">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography.Text type="secondary">图表组件待集成</Typography.Text>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="转化漏斗">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography.Text type="secondary">图表组件待集成</Typography.Text>
            </div>
          </Card>
        </Col>
      </Row>
    </PageTemplate>
  );
}

export default FlowAnalysisPage;