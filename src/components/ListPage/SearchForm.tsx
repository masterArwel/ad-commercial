import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { isArray } from 'lodash';
import { Button, Form, Space } from 'antd';
import type { ColProps, FormInstance, FormItemProps, FormProps } from 'antd';
import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { cn } from '@/utils';

import RenderFormItem from './RenderFormItem';
import { type FormOptions } from './interface';

import './index.css';

const { useForm } = Form;
export interface SearchFormRef {
  formRef: FormInstance;
}

const SearchForm = forwardRef<
  SearchFormRef,
  {
    form?: FormInstance;
    loading?: boolean;
    initialValues?: any;
    formOptions?: FormOptions[];
    onSearch: (values: Record<string, any>) => void;
    onReset?: () => void;
    extraFields?: FormItemProps['name'][];
    extra?: {
      action?: React.ReactNode;
    };
    formProps?: FormProps;
    colProps?: ColProps;
    classNames?: {
      wrapper?: string;
      form?: string;
    };
    autoSearch?: boolean;
  }
>((props, ref) => {
  const formRef = useRef<any>();
  const [innerForm] = useForm();

  const form = props?.form ?? innerForm;
  const { initialValues = {}, formOptions = [], autoSearch = false } = props;

  useImperativeHandle(ref, () => ({
    formRef: form,
  }));

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [JSON.stringify(initialValues)]);

  // 处理表单值变化
  const handleValuesChange = () => {
    if (autoSearch) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      if (formRef.current) {
        await formRef.current.validateFields();
        const values = form.getFieldsValue();
        for (const item in values) {
          if (
            values[item] !== null &&
            typeof values[item] === 'object' &&
            !isArray(values[item])
          ) {
            Object.assign(values, { [item!.toString()]: values[item!].value });
          }
        }
        props.onSearch(values);
      }
    } catch (error) {}
  };

  const handleReset = () => {
    if (typeof props.onReset === 'function') {
      props.onReset();
      return;
    }
    form.resetFields();
    const values = form.getFieldsValue();
    props.onSearch({ ...values });
  };

  return (
    <div className={cn('search-form-wrapper', props?.classNames?.wrapper)}>
      <Form
        form={form}
        ref={formRef}
        initialValues={initialValues}
        className={cn('search-form-items', props?.classNames?.form)}
        labelAlign="right"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onValuesChange={handleValuesChange}
        {...props?.formProps}
      >
        <RenderFormItem colProps={props.colProps} formOptions={formOptions} />
        {props?.extraFields?.map((item, idx) => (
          <Form.Item key={idx} hidden name={item as any}></Form.Item>
        ))}
      </Form>
      <Space orientation='vertical' className="search-action right-button">
        <Button
          loading={props.loading}
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSubmit}
        >
          查询
        </Button>
        <Button
          loading={props.loading}
          icon={<RedoOutlined />}
          onClick={handleReset}
        >
          重置
        </Button>
        {props?.extra?.action}
      </Space>
    </div>
  );
});

export default SearchForm;
