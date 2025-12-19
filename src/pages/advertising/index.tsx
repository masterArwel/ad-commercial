// 广告投放模块首页组件
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * 广告投放模块首页
 */
export function AdvertisingPage() {
  return (
    <div>
      <Title level={2}>广告投放</Title>
      <Card>
        <Paragraph>
          广告投放模块，包含广告主管理、广告计划、广告活动、代理商渠道和数据报表等功能。
        </Paragraph>
      </Card>
    </div>
  );
}

export default AdvertisingPage;