import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  spinning?: boolean;
  children?: React.ReactNode;
}

/**
 * 通用加载组件
 */
export const Loading: React.FC<LoadingProps> = ({
  size = 'default',
  tip = '加载中...',
  spinning = true,
  children,
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 24 : 14 }} spin />;

  if (children) {
    return (
      <Spin spinning={spinning} tip={tip} indicator={antIcon}>
        {children}
      </Spin>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '200px' 
    }}>
      <Spin size={size} tip={tip} indicator={antIcon} />
    </div>
  );
};

export default Loading;