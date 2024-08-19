import { NumberInput } from '@mantine/core';
import React from 'react';
import { IntegerField } from '@yadoms/domain/plugins';
import LinkifyText from '../../linkify-text/linkify-text';
import { FormReturnType } from '../../FormReturnType';

export interface CustomTextInputProps {
  pluginKey: string;
  field: IntegerField;
  form: FormReturnType;
  path: string;
}

export function CustomIntegerInput(props: CustomTextInputProps) {
  return (
    <NumberInput
      {...props.form.getInputProps(props.path)}
      key={props.form.key(props.path)}
      label={props.field.name}
      description={<LinkifyText text={props.field.description} />}
      placeholder={props.field.name}
      inputWrapperOrder={['label', 'error', 'input', 'description']}
      withAsterisk={!!props.field.required}
      min={0}
    />
  );
}

export default CustomIntegerInput;
