import React from 'react';
import type { Dayjs } from 'dayjs';
import { Cascader, DatePicker, Form, Input, Select, Row, Col } from 'antd';
import type { ColProps, FormInstance } from 'antd';

import type {
  FormOptions,
  CustomFormItemProps,
  SearchDatePickerProps,
  SearchFormInputProps,
  SearchFormInputTagProps,
  SearchSelectProps,
  CascaderFormProps,
} from './interface';

import './index.css';

const DEFAULT_COL_PROPS: ColProps = {
  span: 8,
};
export interface SearchFormRef {
  formRef: FormInstance;
}

const RenderFormItem: React.FC<{
  formOptions?: FormOptions[];
  colProps?: ColProps;
}> = props => {
  const { formOptions = [] } = props;

  return (
    <Row
      gutter={24}
      className="search-form-items"
      align="middle"
    >
      {formOptions.map((item, index) => {
        const {
          fieldName,
          colProps,
          type,
          label,
          tooltip: _tooltip,
          rules = [],
          ...rest
        } = item as FormOptions;

        const tooltip = Array.isArray(_tooltip) ? (
          <div>
            {Array.isArray(_tooltip)
              ? _tooltip.map((t, idx) => <p key={idx}> {t}</p>)
              : _tooltip}
          </div>
        ) : (
          _tooltip
        );

        const getLabelText = (): string => {
          if (typeof label === 'string' || typeof label === 'number') {
            return String(label);
          }
          return '';
        };
        const getStringPlaceholder = (custom?: string, prefix?: string) =>
          typeof custom === 'string'
            ? custom
            : `${prefix ?? ''}${getLabelText()}`;

        if (type === 'Input') {
          return (
            <Col
              key={`form-col-${fieldName}-${index}`}
              {...(colProps ?? props.colProps ?? DEFAULT_COL_PROPS)}
            >
              <Form.Item
                label={label}
                name={fieldName}
                tooltip={tooltip}
                rules={rules}
                style={{ alignItems: 'flex-start' }}
              >
                <Input
                  {...(rest as SearchFormInputProps)}
                  placeholder={getStringPlaceholder(
                    (rest as SearchFormInputProps).placeholder,
                    '请输入'
                  )}
                />
              </Form.Item>
            </Col>
          );
        }
        if (type === 'InputTag') {
          return (
            <Col
              key={`form-col-${fieldName}-${index}`}
              {...(colProps ?? props.colProps ?? DEFAULT_COL_PROPS)}
            >
              <Form.Item
                label={label}
                name={fieldName}
                tooltip={tooltip}
                rules={rules}
                style={{ alignItems: 'flex-start' }}
              >
                <Select
                  mode="tags"
                  {...(rest as unknown as SearchFormInputTagProps)}
                  placeholder={
                    (rest as SearchFormInputTagProps).placeholder ??
                    `请输入${getLabelText()}`
                  }
                />
              </Form.Item>
            </Col>
          );
        }
        if (type === 'Select') {
          return (
            <Col
              key={`form-col-${fieldName}-${index}`}
              {...(colProps ?? props.colProps ?? DEFAULT_COL_PROPS)}
            >
              <Form.Item
                label={label}
                name={fieldName}
                tooltip={tooltip}
                rules={rules}
                style={{ alignItems: 'flex-start' }}
              >
                <Select
                  {...(rest as SearchSelectProps)}
                  className="custom-select"
                  placeholder={
                    (rest as SearchSelectProps).placeholder ??
                    `请选择${getLabelText()}`
                  }
                />
              </Form.Item>
            </Col>
          );
        }

        if (type === 'DatePicker') {
          const datePickerProps = rest as SearchDatePickerProps;
          const { onChange: originalOnChange, ...otherDatePickerProps } =
            datePickerProps;

          // 处理日期范围选择，自动设置开始时间为 00:00:00，结束时间为 23:59:59
          const handleDateChange = (
            dates: [Dayjs | null, Dayjs | null] | null,
            dateStrings: [string, string]
          ) => {
            if (dates && dates[0] && dates[1]) {
              // 设置开始时间为当天的 00:00:00
              const startTime = dates[0].startOf('day');
              // 设置结束时间为当天的 23:59:59，使用 set 方法显式设置
              const endTime = dates[1]
                .startOf('day')
                .hour(23)
                .minute(59)
                .second(59)
                .millisecond(999);
              const adjustedDates: [Dayjs, Dayjs] = [startTime, endTime];
              const adjustedDateStrings: [string, string] = [
                startTime.format('YYYY-MM-DD HH:mm:ss'),
                endTime.format('YYYY-MM-DD HH:mm:ss'),
              ];
              originalOnChange?.(adjustedDates, adjustedDateStrings);
            } else {
              originalOnChange?.(dates, dateStrings);
            }
          };

          // 使用 getValueFromEvent 确保表单值被正确转换
          const getValueFromEvent = (
            dates: [Dayjs | null, Dayjs | null] | null
          ) => {
            if (dates && dates[0] && dates[1]) {
              // 设置开始时间为当天的 00:00:00
              const startTime = dates[0].startOf('day');
              // 设置结束时间为当天的 23:59:59，使用 set 方法显式设置
              const endTime = dates[1]
                .startOf('day')
                .hour(23)
                .minute(59)
                .second(59)
                .millisecond(999);
              return [startTime, endTime] as [Dayjs, Dayjs];
            }
            return dates;
          };

          return (
            <Col
              key={`form-col-${fieldName}-${index}`}
              {...(colProps ?? props.colProps ?? DEFAULT_COL_PROPS)}
            >
              <Form.Item
                label={label}
                name={fieldName}
                tooltip={tooltip}
                rules={rules}
                style={{ alignItems: 'flex-start' }}
                getValueFromEvent={getValueFromEvent}
              >
                <DatePicker.RangePicker
                  {...otherDatePickerProps}
                  onChange={handleDateChange}
                />
              </Form.Item>
            </Col>
          );
        }

        if (type === 'Cascader') {
          return (
            <Col
              key={`form-col-${fieldName}-${index}`}
              {...(colProps ?? props.colProps ?? DEFAULT_COL_PROPS)}
            >
              <Form.Item
                label={label}
                name={fieldName}
                tooltip={tooltip}
                rules={rules}
                style={{ alignItems: 'flex-start' }}
              >
                {(() => {
                  const { multiple, ...cProps } = (rest ||
                    {}) as CascaderFormProps;
                  return multiple === true ? (
                    <Cascader
                      placeholder={`请选择${getLabelText()}`}
                      {...(cProps as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
                      multiple
                    />
                  ) : (
                    <Cascader
                      placeholder={`请选择${getLabelText()}`}
                      {...(cProps as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
                    />
                  );
                })()}
              </Form.Item>
            </Col>
          );
        }

        /**
         * 自定义formItem
         */
        if (type === 'Custom') {
          return (
            <Col
              key={`form-col-${fieldName}-${index}`}
              {...(colProps ?? props.colProps ?? DEFAULT_COL_PROPS)}
            >
              <Form.Item
                label={label}
                name={fieldName}
                rules={rules}
                tooltip={tooltip}
                style={{ alignItems: 'flex-start' }}
              >
                {(item as CustomFormItemProps).component}
              </Form.Item>
            </Col>
          );
        }
        return null;
      })}
    </Row>
  );
};

export default RenderFormItem;
