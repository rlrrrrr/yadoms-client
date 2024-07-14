import { CheckboxSectionField, getInitialValuesFromSectionFields } from '@yadoms/domain/plugins';
import { Box, Checkbox } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import renderPluginField from '../../render-plugin-field/render-plugin-field';
import LinkifyText from '../../linkify-text/linkify-text';
import { FormReturnType } from '../../FormReturnType';
import classes from '../components.module.css';

export interface CustomCheckboxSectionProps {
  pluginKey: string;
  field: CheckboxSectionField;
  form: FormReturnType;
  path: string;
}

export function CustomCheckboxSection(props: CustomCheckboxSectionProps) {
  const [checked, setChecked] = useState<boolean>(getValueByPath(props.form.values, props.path));

  useEffect(() => {
    const value = getValueByPath(props.form.values, props.path);
    setChecked(value);
  }, [props.form.values, props.path]);

  return (
    <Box className={classes.box}>
      <Checkbox
        label={props.field.name}
        description={<LinkifyText text={props.field.description} />}
        key={props.form.key(props.path)}
        {...props.form.getInputProps(props.path, { type: 'checkbox' })}
      />

      {checked && (
        <div>
          {getInitialValuesFromSectionFields(
            props.field.content,
            removeCheckboxFromParentPath(props.path),
            ''
          ).map(({ key, path, field }) =>
            renderPluginField({
              field: field,
              form: props.form,
              path: path,
              pluginKey: key,
            })
          )}
        </div>
      )}
    </Box>
  );
}

function removeCheckboxFromParentPath(input: string): string {
  return input.replace(".checkbox", "");
}
function getValueByPath<T>(obj: T, path: string): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}
