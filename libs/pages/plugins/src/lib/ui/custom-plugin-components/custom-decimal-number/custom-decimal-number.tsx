import { NumberInput } from '@mantine/core';
import React from 'react';
import { DecimalField } from '@yadoms/domain/plugins';
import LinkifyText from '../../linkify-text/linkify-text';
import { FormReturnType } from '../../FormReturnType';

export interface CustomDecimalNumberProps {
  pluginKey: string;
  field: DecimalField;
  form: FormReturnType;
  path: string;
}

export function CustomDecimalNumber(props: CustomDecimalNumberProps) {
  return (
    <NumberInput
      {...props.form.getInputProps(props.path)}
      key={props.form.key(props.path)}
      label={props.field.name}
      description={<LinkifyText text={props.field.description} />}
      decimalScale={props.field.precision}
      step={props.field.step}
      inputWrapperOrder={['label', 'error', 'input', 'description']}
      withAsterisk
    />
  );
}

export default CustomDecimalNumber;
