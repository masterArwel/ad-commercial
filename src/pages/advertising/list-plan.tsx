// 广告计划页面组件
import { Button, Space, Tag, Progress } from 'antd';
import type { ColumnProps } from 'antd/es/table';
import ListPage from '@/components/ListPage';
import { planListData } from '@/bffData/plan';
import { FormOptions } from '@/components/ListPage/interface';

interface PlanItem {
  id: string;
  name: string;
  advertiser: string;
  status: 'running' | 'paused' | 'completed';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
}

/**
 * 广告计划页面
 */
export function PlanPage() {

  const columns: ColumnProps<PlanItem>[] = [
    {
      title: '计划名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '广告主',
      dataIndex: 'advertiser',
      key: 'advertiser',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          running: { color: 'green', text: '投放中' },
          paused: { color: 'orange', text: '已暂停' },
          completed: { color: 'blue', text: '已完成' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '预算/消耗',
      key: 'budget',
      render: (_: any, record: PlanItem) => {
        const percentage = (record.spent / record.budget) * 100;
        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              ¥{record.spent.toLocaleString()} / ¥{record.budget.toLocaleString()}
            </div>
            <Progress percent={Math.round(percentage)} size="small" />
          </div>
        );
      },
    },
    {
      title: '投放时间',
      key: 'dateRange',
      render: (_, record) => `${record.startDate} ~ ${record.endDate}`,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: PlanItem) => (
        <Space size="small">
          {record.status === 'running' ? (
            <Button size="small" type="link">
              暂停
            </Button>
          ) : (
            <Button size="small" type="link">
              启动
            </Button>
          )}
          <Button size="small" type="link">
            编辑
          </Button>
          <Button size="small" danger type="link">
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const searchFormOptions: FormOptions[] = [
    {
      label: '计划名称',
      fieldName: 'name',
      type: 'Input',
    },
    {
      label: '计划ID',
      fieldName: 'campaignId',
      type: 'Input',
    },
    {
      label: '活动名称',
      fieldName: 'campaignType',
      type: 'Input',
    },
    {
      label: '推广类型',
      fieldName: 'promotionType',
      type: 'Select',
      options: [
        { label: '全部', value: 'all' },
        { label: '效果广告', value: 'effect' },
        { label: '品牌广告', value: 'brand' },
        { label: '程序化购买', value: 'programmatic' },
      ],
    },
    {
      label: '计划状态',
      fieldName: 'planStatus',
      type: 'Select',
      options: [
        { label: '全部', value: 'all' },
        { label: '投放中', value: 'running' },
        { label: '已暂停', value: 'paused' },
        { label: '已完成', value: 'completed' },
      ],
    },
    {
      label: '投放时间',
      fieldName: 'dateRange',
      type: 'DatePicker',
    },

    {
      label: '广告主',
      fieldName: 'advertiser',
      type: 'Input',
    },
    {
      label: '创建人',
      fieldName: 'creator',
      type: 'Input',
    },
  ];

  const queryFn = () => {
    return Promise.resolve({
      data: planListData,
      total: planListData.length,
    });
  };


  return (
    <ListPage
      columns={columns}
      queryFn={queryFn}
      formOptions={searchFormOptions}
    />
  );
}

export default PlanPage;