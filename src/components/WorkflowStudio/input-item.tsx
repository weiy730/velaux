import { Grid, Input, Form, Select, Button, Icon } from '@b-design/ui';
import React, { useContext, useState } from 'react';
import type { InputItem, OutputItem } from '../../interface/application';
import locale from '../../utils/locale';
import _ from 'lodash';
import { WorkflowEditContext } from '../../context';
const { Row, Col } = Grid;

export const InputItemForm = (props: { value?: InputItem; onChange: (i: InputItem) => void }) => {
  const [from, setFrom] = useState<string>(props.value ? props.value.from : '');
  const [parameterKey, setParameterKey] = useState<string>(props.value?.parameterKey || '');
  const fromChange = (value: string) => {
    setFrom(value);
    if (value != '' && parameterKey != '') {
      props.onChange({ from: value, parameterKey: parameterKey });
    }
  };
  const parameterKeyChange = (value: string) => {
    setParameterKey(value);
    if (value != '' && from != '') {
      props.onChange({ from: from, parameterKey: value });
    }
  };

  const { steps, stepName } = useContext(WorkflowEditContext);
  const fromItemOptions: { value: string }[] = [];

  const convertOutputs = (outputs?: OutputItem[]) => {
    if (!outputs) {
      return;
    }
    outputs.map((out) => {
      fromItemOptions.push({ value: out.name });
    });
  };
  steps?.map((step) => {
    if (step.name != stepName) {
      convertOutputs(step.outputs);
    }
    step.subSteps?.map((subStep) => {
      if (subStep.name != stepName) {
        convertOutputs(subStep.outputs);
      }
    });
  });

  return (
    <div className="item-form">
      <Row>
        <Col className="from" span={12} style={{ paddingLeft: '8px' }}>
          <Form.Item label="From" labelAlign="inset">
            <Select
              dataSource={fromItemOptions}
              locale={locale().Select}
              value={from}
              onChange={fromChange}
            />
          </Form.Item>
        </Col>
        <Col span={12} style={{ paddingRight: '8px' }}>
          <Form.Item label="ParameterKey" labelAlign="inset">
            <Input value={parameterKey} onChange={parameterKeyChange} />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export const InputItems = (props: {
  value?: InputItem[];
  id: string;
  onChange: (items: InputItem[]) => void;
}) => {
  const [items, setItems] = useState<InputItem[]>(props.value || [{ from: '', parameterKey: '' }]);
  const onChange = (update: InputItem[]) => {
    props.onChange(update.filter((item) => item.from != '' && item.parameterKey != ''));
  };

  return (
    <div id={props.id} className="input-items">
      {items?.map((item, index) => {
        return (
          <div className="item">
            <InputItemForm
              key={item.from}
              value={item}
              onChange={(input) => {
                items[index].from = input.from;
                items[index].parameterKey = input.parameterKey;
                onChange(items);
              }}
            />

            {index != 0 && (
              <div className="item-delete">
                <Button
                  onClick={() => {
                    const newItems = _.cloneDeep(items);
                    newItems.splice(index, 1);
                    setItems(newItems);
                    onChange(newItems);
                  }}
                  size="small"
                  type="secondary"
                  style={{ justifyContent: 'center', marginLeft: '8px' }}
                >
                  <Icon type="semi-select" />
                </Button>
              </div>
            )}
          </div>
        );
      })}

      <Button
        onClick={() => {
          const newItems = _.cloneDeep(items);
          newItems.push({ from: '', parameterKey: '' });
          setItems(newItems);
        }}
        size="small"
        type="secondary"
        style={{ justifyContent: 'center', marginLeft: '8px' }}
      >
        <Icon type="add" />
      </Button>
    </div>
  );
};
