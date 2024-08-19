import { CustomTimeField } from '@yadoms/domain/plugins';
import { TimeInput } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';
import LinkifyText from '../../linkify-text/linkify-text';
import React from 'react';
import { FormReturnType } from '../../FormReturnType';

export interface CustomTimeProps {
  pluginKey: string;
  field: CustomTimeField;
  form: FormReturnType;
  path: string;
}

export function CustomTime(props: CustomTimeProps) {
  return (
    <TimeInput
      {...props.form.getInputProps(props.path)}
      key={props.form.key(props.path)}
      leftSection={<IconClock size="1rem" stroke={1.5} />}
      label={props.field.name}
      description={<LinkifyText text={props.field.description} />}
      required={props.field.required}
      withAsterisk={props.field.required}
    />
  );
}
