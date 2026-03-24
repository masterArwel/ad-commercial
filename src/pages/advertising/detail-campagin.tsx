import dayjs from 'dayjs';
import qs from 'query-string';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Grid,
  Input,
  InputNumber,
  Message,
  Radio,
  Space,
  Switch,
} from 'antd';

import { getAccountDetail } from '@/apis/advertising/account';
import { add, editDetail, getDetail } from '@/apis/advertising/campaign';
import { getEmployeeByName } from '@/apis/common';
import SearchSelect from '@/components/SearchSelect';
import { EnumType } from '@/constants';
import { formatDate, formatNumberWithCommas } from '@/utils/format';
import { isObject } from '@/utils/is';

import { CurrencyLevel, CurrencyLevelEnum } from '../const';
import AdvAccount from './components/AdvAccount';

import './index.css';


const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 12,
  },
  colon: true,
  scrollToFirstError: true,
};

const initFormData = {
  channelOrder: false,
  activityType: '2',
  chargeType: '0',
  frequencyCap: {
    strategy: 2,
  },
};

function AddForm() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form] = Form.useForm();
  const { type } = qs.parse(location.search);

  const [advOrAgentInfo, setAdvOrAgentInfo] = useState({} as any);
  const [balance, setBalance] = useState(0);
  const [channelDefaultList, setChannelDefaultList] = useState(undefined);
  const [salesManagerDefaultList, setSalesManagerDefaultList] =
    useState(undefined);
  const [channelManagerDefaultList, setChannelManagerDefaultList] =
    useState(undefined);
  const [canPDB, setCanPDB] = useState(false); // 是否可以创建 PDB 广告
  const frequencyPeriod = Form.useWatch('frequencyCap.strategy', form);
  // const enableFrequency = Form.useWatch('enableFrequency', form);
  const [dates, setDates] = useState([]);
  const [enabledStrategy, setEnabledStrategy] = useState(false); // 频控周期是否可编辑
  const [enableFrequencyDisabled, setEnableFrequencyDisabled] = useState(false); // 频次控制是否可编辑
  const [hasProcessingPlan, setHasProcessingPlan] = useState(false); // 是否存在进行中的计划

  const salesManagerSelectProps = {
    list: salesManagerDefaultList,
    searchService: getEmployeeByName,
    searchParams: (val) => ({
      pageIndex: 1,
      pageSize: 10,
      employeeName: val,
    }),
    labelKey: 'trueName',
    valueKey: 'workNum',
  };

  const channelManagerSelectProps = {
    list: channelManagerDefaultList,
    searchService: getEmployeeByName,
    searchParams: (val) => ({
      pageIndex: 1,
      pageSize: 10,
      employeeName: val,
    }),
    labelKey: 'trueName',
    valueKey: 'workNum',
  };

  const handleSubmit = async () => {
    await form.validate();
    const values = form.getFields();
    if (values.channelOrder === true && !values.agencyId) {
      Message.error('请选择渠道！');
      return;
    }
    if ((values.budget ?? 0) !== 0 && values.budget < 0.01) {
      Message.error('广告活动总预算需大于等于0.01！');
      return;
    }
    if (!values.enableFrequency) {
      values.frequencyCap = null;
    }
    const params = {
      ...values,
      agencyId: values.channelOrder ? values.agencyId?.value : null,
      startDate: new Date(values.dateCycle[0]).setHours(0, 0, 0, 0),
      endDate: new Date(values.dateCycle[1]).setHours(23, 59, 59, 999),
      budget: values.budget,
      salesManager: isObject(values.salesManager)
        ? values.salesManager?.workNum || ''
        : values.salesManager,
      salesManagerName: null,
      channelManager: isObject(values.channelManager)
        ? values.channelManager?.workNum || ''
        : values.channelManager,
      channelManagerName: null,
    };
    const submitRes = values.activityId
      ? await editDetail(params)
      : await add(params);
    if (submitRes) {
      Message.success('操作成功');
      navigate('/advertising/campaign');
    } else {
      Message.error('操作失败！');
    }
  };

  // 代理渠道商改变
  const agencyIdChange = (e) => {
    setBalance(e.availableBalance);
    setCanPDB(e.accessType !== 1);
    form.setFieldValue('advType', e.accessType);
  };

  // 切换渠道下单变更账户余额显示
  const channelOrderChange = (e) => {
    form.setFieldValue('currencyLevel', null);
    if (!e) {
      setBalance(state?.advBalance);
      form.setFieldsValue({
        advType: advOrAgentInfo.accessType,
        relationMerchantId: advOrAgentInfo.relationMerchantId,
      });
      setCanPDB(advOrAgentInfo.accessType !== 1);
    } else {
      form.setFieldValue('agencyId', '');
    }
  };

  useEffect(() => {
    const init = async () => {
      if (campaignId) {
        // 编辑
        const { data } = await getDetail({ guid: campaignId });
        setChannelDefaultList([
          { label: data.agencyName, value: data.agencyId },
        ]);
        setSalesManagerDefaultList([
          {
            label: `${data.salesManagerName}(${data.salesManager})`,
            value: data.salesManager,
          },
        ]);
        setChannelManagerDefaultList([
          {
            label: `${data.channelManagerName}(${data.channelManager})`,
            value: data.channelManager,
          },
        ]);

        const { data: advRes } = (await getAccountDetail({
          id: data.advertiserId,
        })) as any;
        setAdvOrAgentInfo(advRes);

        const formData = {
          ...data,
          advType: data.channelOrder
            ? data.agencyAccessType
            : data.advertiserAccessType,
          relationMerchantId: data.channelOrder
            ? data.agencyMerchantId
            : data.advertiserMerchantId,
          agencyId: { value: data.agencyId },
          dateCycle: [formatDate(data.startDate), formatDate(data.endDate)],
          currencyLevel: Number(data.currencyLevel),
          frequencyCap: {
            ...data.frequencyCap,
            strategy: parseInt(data.frequencyStrategy) || 2,
          },
        };
        setEnabledStrategy(!data.frequencyStrategy);
        form.setFieldsValue(formData);
        // 活动下有进行中的计划 且是PDB 广告 时 无法修改频次控制
        setEnableFrequencyDisabled(
          data.hasProcessingPlan &&
            Number(data.currencyLevel) === CurrencyLevelEnum.pdb,
        );
        setCanPDB(Number(data.currencyLevel) === CurrencyLevelEnum.pdb);
        setHasProcessingPlan(data.hasProcessingPlan);
      } else {
        // 创建
        const { advertiserId, advBalance } = state || {};
        const { data: advRes } = (await getAccountDetail({
          id: advertiserId,
        })) as any;
        setAdvOrAgentInfo(advRes);
        form.setFieldsValue({
          relationMerchantId: advRes.relationMerchantId,
          advType: advRes.accessType,
          advertiserName: advRes.accountName,
          advertiserId: advRes.id,
          dateCycle: [formatDate(dayjs()), formatDate(dayjs().add(14, 'days'))],
        });

        setBalance(advBalance);
        setCanPDB(advRes.accessType !== 1); // 非程序化三方类型的广告主/渠道主
      }
    };
    init();
  }, [campaignId]);

  // 改变活动类型
  const handleChangeActivityType = () => {
    form.setFieldValue('currencyLevel', null);
  };

  return (
    <Card>
      <Form
        {...formLayout}
        className="form-wrapper"
        autoComplete="off"
        initialValues={initFormData}
        form={form}
        disabled={type === EnumType.VIEW}
      >
        <Form.Item label="广告主" field="advertiserName">
          <Input placeholder="请输入广告主名称" disabled />
        </Form.Item>
        <Form.Item
          label="广告活动名称"
          field="activityName"
          rules={[
            {
              required: true,
              type: 'string',
              minLength: 2,
              message: '广告活动名称需 2 - 20 个字符',
            },
          ]}
        >
          <Input
            minLength={2}
            maxLength={20}
            showWordLimit
            placeholder="请输入广告活动名称"
          />
        </Form.Item>
        <Form.Item
          label="广告活动周期"
          field="dateCycle"
          rules={[{ required: true, message: '请选择广告活动周期' }]}
          disabled={
            type === EnumType.VIEW ||
            (hasProcessingPlan === true &&
              frequencyPeriod === 2 &&
              type === EnumType.EDIT)
          }
        >
          <DatePicker.RangePicker
            onSelect={(valueString, value) => {
              setDates(value);
            }}
            onVisibleChange={(visible) => {
              if (!visible) {
                setDates([]);
              }
            }}
            disabledDate={(current) => {
              if (current.isBefore(dayjs(), 'day')) {
                return true;
              }
              if (dates && dates.length) {
                const tooLate =
                  dates[0] && Math.abs(current.diff(dates[0], 'day')) > 60;
                const tooEarly =
                  dates[1] && Math.abs(dates[1].diff(current, 'day')) > 60;
                return tooEarly || tooLate;
              }
              return false;
            }}
            clearRangeOnReselect
          />
        </Form.Item>
        <Form.Item
          label="渠道下单"
          rules={[{ required: true, message: '请选择渠道下单' }]}
        >
          <Space align="center">
            <Form.Item
              field="channelOrder"
              noStyle
              disabled={Boolean(campaignId)}
            >
              <Radio.Group onChange={channelOrderChange}>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item noStyle={{ showErrorTip: true }} shouldUpdate>
              {(values) => {
                return values.channelOrder === true ? (
                  <Form.Item
                    field="agencyId"
                    noStyle={{ showErrorTip: true }}
                    hasFeedback
                    rules={[{ required: true, message: '请选择渠道' }]}
                  >
                    <AdvAccount
                      className="channel-style"
                      disabled={Boolean(campaignId)}
                      list={channelDefaultList}
                      extRequest={{ commercialAccountType: 2, status: 1 }}
                      placeholder="请输入渠道名称"
                      onChange={agencyIdChange}
                    />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item
          label="广告活动类型"
          field="activityType"
          rules={[{ required: true }]}
          disabled={Boolean(campaignId)}
        >
          <Radio.Group onChange={handleChangeActivityType}>
            <Radio value="1">品牌推广</Radio>
            <Radio value="2">效果推广</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {(values) => {
            return (
              <Form.Item
                label="货币化层级"
                rules={[{ required: true, message: '请选择货币化层级' }]}
                field="currencyLevel"
                disabled={Boolean(campaignId)}
              >
                <Radio.Group>
                  <Radio value={CurrencyLevelEnum.pd}>
                    {CurrencyLevel[CurrencyLevelEnum.pd]}
                  </Radio>
                  <Radio value={CurrencyLevelEnum.rtb}>
                    {CurrencyLevel[CurrencyLevelEnum.rtb]}
                  </Radio>
                  {/* {values.activityType === '1' && canPDB ? (
                    <Radio value={CurrencyLevelEnum.pdb}>
                      {CurrencyLevel[CurrencyLevelEnum.pdb]}
                    </Radio>
                  ) : null} */}
                  {values.advType === 1 && values.activityType === '1' ? (
                    <Radio value={CurrencyLevelEnum.pdb}>
                      {CurrencyLevel[CurrencyLevelEnum.pdb]}
                    </Radio>
                  ) : values.activityType === '1' && canPDB ? (
                    <Radio value={CurrencyLevelEnum.pdb}>
                      {CurrencyLevel[CurrencyLevelEnum.pdb]}
                    </Radio>
                  ) : null}
                </Radio.Group>
              </Form.Item>
            );
          }}
        </Form.Item>
        <Form.Item
          field="enableFrequency"
          label="频次控制"
          triggerPropName="checked"
          disabled={
            type === EnumType.VIEW ||
            (enableFrequencyDisabled && type === EnumType.EDIT)
          }
        >
          <Switch checkedText="ON" uncheckedText="OFF" />
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {(values) => {
            return values.enableFrequency ? (
              <>
                {values.currencyLevel === CurrencyLevelEnum.pd ||
                values.currencyLevel === CurrencyLevelEnum.rtb ? (
                  <Form.Item
                    field="frequencyCap.strategy"
                    label="频控周期"
                    rules={[{ required: true, message: '请选择频控周期' }]}
                    disabled={
                      type === EnumType.VIEW ||
                      (!enabledStrategy && type === EnumType.EDIT)
                    }
                  >
                    <Radio.Group
                      options={[
                        { label: '活动周期内频控', value: 2 },
                        { label: '按自然天投放', value: 3 },
                      ]}
                    />
                  </Form.Item>
                ) : null}
                <Form.Item
                  field="frequencyCap.capFrequency"
                  label="频控次数"
                  disabled={
                    type === EnumType.VIEW ||
                    // 编辑状态下
                    // 1. pdb 并且当前活动下有进行中的计划 不可编辑
                    (hasProcessingPlan &&
                      values.currencyLevel === CurrencyLevelEnum.pdb)
                  }
                  rules={[{ required: true, message: '请输入频控次数' }]}
                >
                  <InputNumber
                    min={1}
                    max={100}
                    precision={0}
                    placeholder="请输入频控次数"
                  />
                </Form.Item>
                {values.currencyLevel !== CurrencyLevelEnum.pdb ? (
                  <Form.Item
                    field="frequencyCap.timeInterval"
                    label="间隔时长"
                    rules={[{ required: true, message: '请输入间隔时长' }]}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      precision={0}
                      placeholder="请输入间隔时长"
                      suffix="小时"
                    />
                  </Form.Item>
                ) : null}
              </>
            ) : null;
          }}
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {(values) => {
            return values.advType === 1 ? (
              <Form.Item
                label="计算方式"
                field="chargeType"
                rules={[{ required: true, message: '请选择计算方式' }]}
              >
                <Radio.Group>
                  <Radio value={'1'}>三方计费</Radio>
                  {values.relationMerchantId ? (
                    <Radio value={'0'}>哈啰广告账户计费</Radio>
                  ) : null}
                </Radio.Group>
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {(values) => {
            return values.relationMerchantId ? (
              <Form.Item
                label="广告活动总预算"
                rules={[{ required: true, message: '请输入广告活动总预算' }]}
              >
                <Row>
                  <Col span={12}>
                    <Form.Item noStyle shouldUpdate>
                      {(values) => {
                        return (
                          <Form.Item
                            field="budget"
                            noStyle={{ showErrorTip: true }}
                            rules={[
                              {
                                required: true,
                                type: 'number',
                                max: 99999999,
                                message: '请在合理范围内设置广告活动总预算',
                              },
                            ]}
                          >
                            <InputNumber
                              min={0.01}
                              max={99999999}
                              precision={2}
                              className="w-full"
                              placeholder="请输入广告活动总预算"
                            />
                          </Form.Item>
                        );
                      }}
                    </Form.Item>
                  </Col>
                  <Col offset={1} span={10} style={{ marginTop: '5px' }}>
                    {balance ? (
                      <div>
                        当前可用余额：￥{formatNumberWithCommas(balance)}
                      </div>
                    ) : null}
                  </Col>
                </Row>
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
        <Form.Item
          label="销售经理"
          field="salesManager"
          rules={[{ required: true, message: '请选择销售经理' }]}
        >
          <SearchSelect {...salesManagerSelectProps} />
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {(values) => {
            return values.agencyId && values.channelOrder === true ? (
              <Form.Item label="渠道经理" field="channelManager">
                <SearchSelect {...channelManagerSelectProps} />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
        <Form.Item>
          <Space size={20} style={{ marginLeft: '100px' }}>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={type === EnumType.VIEW}
            >
              提交
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                navigate(-1);
              }}
            >
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default AddForm;
