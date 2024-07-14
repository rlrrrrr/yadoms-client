import { Checkbox } from '@mantine/core';
import React from 'react';
import { BooleanField } from '@yadoms/domain/plugins';
import LinkifyText from '../../linkify-text/linkify-text';
import { FormReturnType } from '../../FormReturnType';

export interface CustomBoolCheckboxProps {
  pluginKey: string;
  field: BooleanField;
  form: FormReturnType;
  path: string;
}

export function CustomBoolCheckbox(props: CustomBoolCheckboxProps) {
  return (
    <Checkbox
      key={props.form.key(props.path)}
      {...props.form.getInputProps(props.path, { type: 'checkbox' })}
      label={props.field.name}
      description={<LinkifyText text={props.field.description} />}
      p={2}
    />
  );
}

export default CustomBoolCheckbox;
