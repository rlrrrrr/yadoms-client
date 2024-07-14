import {
  PluginConfigurationSchema,
  PluginConfigurationSchemaField,
  PluginConfigurationSchemaType,
  PluginMultiSelectSectionConfigurationSchema,
  PluginSectionConfigurationSchema,
} from '../model/plugin-configuration-schema.model';

export interface InitialValues {
  type: string;
  displayName: string;
  configurationSchema: PluginConfigurationSchema;
}

export const getInitialValues = (initialValues: InitialValues) => {
  return {
    type: initialValues.type,
    displayName: initialValues.displayName,
    configuration: getFromInitialValues(initialValues.configurationSchema),
  };
};

export const getFromInitialValues = (
  configurationSchema: PluginConfigurationSchema
): Record<string, unknown> => {
  const newInitialValues: Record<string, unknown> = {};

  for (const [key, field] of Object.entries(configurationSchema)) {
    let sectionKeys: string[] = [];

    switch (field.type) {
      case PluginConfigurationSchemaType.String:
      case PluginConfigurationSchemaType.Integer:
      case PluginConfigurationSchemaType.Boolean:
      case PluginConfigurationSchemaType.Decimal:
      case PluginConfigurationSchemaType.Enum:
        newInitialValues[key] = {
          ...field,
          value: field.defaultValue ?? field.value,
        };
        break;
      case PluginConfigurationSchemaType.Section:
        newInitialValues[key] = {
          ...field,
          ...(field.content && {
            content: getFromInitialValues(field.content),
          }),
        };
        break;
      case PluginConfigurationSchemaType.ComboSection:
        sectionKeys = Object.keys(field.content);
        const firstSectionKey = sectionKeys[0];
        newInitialValues[key] = {
          ...field,
          content: getFromInitialValues(field.content),
          ...(field.activeSection ? {} : { activeSection: firstSectionKey }),
        };
        break;
      case PluginConfigurationSchemaType.CheckboxSection:
        newInitialValues[key] = {
          ...field,
          content: getFromInitialValues(field.content),
          ...(field.defaultValue && { checkbox: field.defaultValue }),
        };
        break;
      case PluginConfigurationSchemaType.MultiSelectSection:
        newInitialValues[key] = {
          ...field,
          content: getFromInitialValues(field.content),
        };
        break;
      default:
        break;
    }
  }
  return newInitialValues;
};

export const getFromInitialValuesTest = (
  configurationSchema:
    | PluginConfigurationSchema
    | PluginSectionConfigurationSchema
    | PluginMultiSelectSectionConfigurationSchema,
  parentKey = 'configuration'
): Array<{
  key: string;
  path: string;
  field: PluginConfigurationSchemaField;
}> => {
  const newInitialValues: Array<{
    key: string;
    path: string;
    field: PluginConfigurationSchemaField;
  }> = [];
  for (const [key, field] of Object.entries(configurationSchema)) {
    const path = parentKey ? `${parentKey}.${key}` : key;

    switch (field?.type) {
      case PluginConfigurationSchemaType.Enum:
      case PluginConfigurationSchemaType.String:
      case PluginConfigurationSchemaType.CustomTime:
      case PluginConfigurationSchemaType.Boolean:
      case PluginConfigurationSchemaType.Decimal:
      case PluginConfigurationSchemaType.Integer:
        newInitialValues.push({ key: key, path: path, field: field });
        break;
      case PluginConfigurationSchemaType.Section:
      case PluginConfigurationSchemaType.ComboSection:
      case PluginConfigurationSchemaType.RadioSection:
      case PluginConfigurationSchemaType.CheckboxSection:
      case PluginConfigurationSchemaType.MultiSelectSection:
        newInitialValues.push({ key: key, path: path, field: field });
        break;
      default:
    }
  }
  console.log('newInitialValues', newInitialValues);
  return newInitialValues;
};

export const getInitialValuesFromSectionFields = (
  configurationSchema:
    | PluginSectionConfigurationSchema
    | PluginMultiSelectSectionConfigurationSchema,
  parentKey = '',
  selectedKey: string
): Array<{
  key: string;
  path: string;
  field: PluginConfigurationSchemaField;
}> => {
  const newInitialValues: Array<{
    key: string;
    path: string;
    field: PluginConfigurationSchemaField;
  }> = [];
  for (const [key, field] of Object.entries(configurationSchema)) {
    switch (field?.type) {
      case PluginConfigurationSchemaType.CheckboxSection:
        newInitialValues.push({
          key: key,
          path: `${parentKey}.content.${key}`,
          field: field,
        });
        break;
      case PluginConfigurationSchemaType.ComboSection:
        newInitialValues.push({
          key: key,
          path: `${parentKey}.${selectedKey}.content.${key}`,
          field: field,
        });
        break;
      default:
        newInitialValues.push({
          key: key,
          path: `${parentKey}.${selectedKey}.content.${key}`,
          field: field,
        });
    }
  }
  return newInitialValues;
};
