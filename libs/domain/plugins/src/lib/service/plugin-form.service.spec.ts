import {
  PluginConfigurationSchema,
  PluginConfigurationSchemaType,
} from '../model/plugin-configuration-schema.model';
import { expect } from 'vitest';
import { getInitialValues } from './plugin-form.service';

describe('Plugin form store', () => {
  describe(`setup the correct form`, () => {
    describe(`for primitive types`, () => {
      test(`should return empty string when defaultValue does not exist`, () => {
        const payload = buildPayload({
          stringKey: {
            type: PluginConfigurationSchemaType.String,
            value: '',
            name: 'name',
            description: 'description',
          },
        });
        const initialValues = getInitialValues(payload);

        expect(initialValues.type).toBe('type');
        expect(initialValues.displayName).toBe('displayName');
        expect(initialValues.configuration).toEqual({
          stringKey: {
            type: PluginConfigurationSchemaType.String,
            value: '',
            name: 'name',
            description: 'description',
          },
        });
      });
      test(`should return default value when the value exist`, () => {
        const payload = buildPayload({
          stringKey: {
            type: PluginConfigurationSchemaType.String,
            defaultValue: 'default value',
            value: '',
            name: 'name',
            description: 'description',
          },
        });

        const initialValues = getInitialValues(payload);
        expect(initialValues.configuration).toEqual({
          stringKey: {
            type: PluginConfigurationSchemaType.String,
            defaultValue: 'default value',
            value: 'default value',
            name: 'name',
            description: 'description',
          },
        });
      });
    });

    describe(`for section type`, () => {
      test(`should return section and nested content`, () => {
        const payload = buildPayload({
          sectionKeyName: {
            type: PluginConfigurationSchemaType.Section,
            content: {
              stringKey: {
                type: PluginConfigurationSchemaType.String,
                defaultValue: 'default value',
                value: 'default value',
                name: 'name',
                description: 'description',
              },
            },
          },
        });

        const initialValues = getInitialValues(payload);
        expect(initialValues.configuration).toEqual({
          sectionKeyName: {
            type: PluginConfigurationSchemaType.Section,
            content: {
              stringKey: {
                type: PluginConfigurationSchemaType.String,
                defaultValue: 'default value',
                value: 'default value',
                name: 'name',
                description: 'description',
              },
            },
          },
        });
      });

      test(`should return section without content`, () => {
        const payload = buildPayload({
          sectionKeyName: {
            type: PluginConfigurationSchemaType.Section,
          },
        });

        const initialValues = getInitialValues(payload);
        expect(initialValues.configuration).toEqual({
          sectionKeyName: {
            type: PluginConfigurationSchemaType.Section,
          },
        });
      });
    });

    describe(`for comboSection type`, () => {
      test(`should initialize activeSection by the first element if no active section is filled`, () => {
        const payload = buildPayload({
          sectionKeyName: {
            type: PluginConfigurationSchemaType.ComboSection,
            name: 'comboSection name',
            activeSection: '',
            content: {
              stringKey: {
                type: PluginConfigurationSchemaType.String,
                defaultValue: 'default value',
                value: 'default value',
                name: 'name',
                description: 'description',
              },
            },
          },
        });

        const initialValues = getInitialValues(payload);
        expect(initialValues.configuration).toEqual({
          sectionKeyName: {
            type: PluginConfigurationSchemaType.ComboSection,
            name: 'comboSection name',
            activeSection: 'stringKey',
            content: {
              stringKey: {
                type: PluginConfigurationSchemaType.String,
                defaultValue: 'default value',
                value: 'default value',
                name: 'name',
                description: 'description',
              },
            },
          },
        });
      });
      test(`should use active section if the field is filled`, () => {
        const payload = buildPayload({
          sectionKeyName: {
            type: PluginConfigurationSchemaType.ComboSection,
            name: 'comboSection name',
            activeSection: 'booleanKey',
            content: {
              stringKey: {
                type: PluginConfigurationSchemaType.String,
                defaultValue: 'default value',
                value: 'default value',
                name: 'name',
                description: 'description',
              },
              booleanKey: {
                type: PluginConfigurationSchemaType.Boolean,
                defaultValue: true,
                value: false,
                name: 'name',
                description: 'description',
              },
            },
          },
        });

        const initialValues = getInitialValues(payload);
        expect(initialValues.configuration).toEqual({
          sectionKeyName: {
            type: PluginConfigurationSchemaType.ComboSection,
            name: 'comboSection name',
            activeSection: 'booleanKey',
            content: {
              stringKey: {
                type: PluginConfigurationSchemaType.String,
                defaultValue: 'default value',
                value: 'default value',
                name: 'name',
                description: 'description',
              },
              booleanKey: {
                type: PluginConfigurationSchemaType.Boolean,
                defaultValue: true,
                value: true,
                name: 'name',
                description: 'description',
              },
            },
          },
        });
      });
    });

    describe(`for checkboxSection type`, () => {
      test(`should initialize checkbox field by the the default value`, () => {
        const payload = buildPayload({
          sectionKeyName: {
            type: PluginConfigurationSchemaType.CheckboxSection,
            name: 'checkboxSection name',
            defaultValue: true,
            checkbox: false,
            content: {
              stringKey: {
                type: PluginConfigurationSchemaType.String,
                defaultValue: 'default value',
                value: 'default value',
                name: 'name',
                description: 'description',
              },
            },
          },
        });

        const initialValues = getInitialValues(payload);
        expect(initialValues.configuration).toEqual({
          sectionKeyName: {
            type: PluginConfigurationSchemaType.CheckboxSection,
            name: 'checkboxSection name',
            checkbox: true,
            defaultValue: true,
            content: {
              stringKey: {
                type: PluginConfigurationSchemaType.String,
                defaultValue: 'default value',
                value: 'default value',
                name: 'name',
                description: 'description',
              },
            },
          },
        });
      });
      test(`should use checkbox value if no default value exist`, () => {
        const payload = buildPayload({
          sectionKeyName: {
            type: PluginConfigurationSchemaType.CheckboxSection,
            name: 'checkboxSection name',
            checkbox: false,
            content: {
              stringKey: {
                type: PluginConfigurationSchemaType.String,
                defaultValue: 'default value',
                value: 'default value',
                name: 'name',
                description: 'description',
              },
            },
          },
        });

        const initialValues = getInitialValues(payload);
        expect(initialValues.configuration).toEqual({
          sectionKeyName: {
            type: PluginConfigurationSchemaType.CheckboxSection,
            name: 'checkboxSection name',
            checkbox: false,
            content: {
              stringKey: {
                type: PluginConfigurationSchemaType.String,
                defaultValue: 'default value',
                value: 'default value',
                name: 'name',
                description: 'description',
              },
            },
          },
        });
      });
    });

    describe(`for multiSelectSection type`, () => {
      test(`should initialize checkbox field by the the default value`, () => {
        const payload = buildPayload({
          sectionKeyName: {
            type: PluginConfigurationSchemaType.MultiSelectSection,
            name: 'checkboxSection name',
            description: 'description',
            placeholder: 'placeholder',
            nothingFound: 'nothingFound message',
            content: {
              boolKey: {
                type: PluginConfigurationSchemaType.Boolean,
                defaultValue: true,
                value: true,
                name: 'name',
                description: 'description',
              },
              boolKey2: {
                type: PluginConfigurationSchemaType.Boolean,
                defaultValue: false,
                value: false,
                name: 'name',
                description: 'description',
              },
            },
          },
        });

        const initialValues = getInitialValues(payload);
        expect(initialValues.configuration).toEqual({
          sectionKeyName: {
            type: PluginConfigurationSchemaType.MultiSelectSection,
            name: 'checkboxSection name',
            description: 'description',
            placeholder: 'placeholder',
            nothingFound: 'nothingFound message',
            content: {
              boolKey: {
                type: PluginConfigurationSchemaType.Boolean,
                defaultValue: true,
                value: true,
                name: 'name',
                description: 'description',
              },
              boolKey2: {
                type: PluginConfigurationSchemaType.Boolean,
                defaultValue: false,
                value: false,
                name: 'name',
                description: 'description',
              },
            },
          },
        });
      });
    });

    function buildPayload(configurationSchema: PluginConfigurationSchema) {
      const payload = {
        type: 'type',
        displayName: 'displayName',
        configurationSchema: configurationSchema,
      };
      return payload;
    }
  });
});
