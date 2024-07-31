import { Box, Text } from '@mantine/core';
import React from 'react';
import renderPluginField from '../../render-plugin-field/render-plugin-field';
import { getNestedSectionFields, SectionField } from '@yadoms/domain/plugins';
import LinkifyText from '../../linkify-text/linkify-text';
import { FormReturnType } from '../../FormReturnType';
import classes from '../components.module.css';

export interface CustomSectionProps {
  pluginKey: string;
  field: SectionField;
  form: FormReturnType;
  path: string;
}

export function CustomSection(props: CustomSectionProps) {
  return (
    <Box className={classes.box}>
      <div key={props.pluginKey}>
        <label>{props.field.name}</label>
        <Text fz="xs" c="dark.2">
          <LinkifyText text={props.field.description} />
        </Text>
        <div style={{ marginLeft: '10px' }}>
          {props.field.content && (
            <div>
              {getNestedSectionFields(props.field.content, props.path, '').map(
                ({ key, path, field }) =>
                  renderPluginField({
                    field: field,
                    form: props.form,
                    path: path,
                    pluginKey: key,
                  })
              )}
            </div>
          )}
        </div>
      </div>
    </Box>
  );
}

export default CustomSection;
