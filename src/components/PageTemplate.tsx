import { Typography } from 'antd';
import { ReactNode } from 'react';

const { Title, Paragraph } = Typography;

interface PageTemplateProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * 通用页面模板组件
 */
export const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>{title}</Title>
        {description && <Paragraph>{description}</Paragraph>}
      </div>
      {children}
    </div>
  );
};

export default PageTemplate;