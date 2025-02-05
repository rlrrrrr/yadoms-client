import type { Meta } from '@storybook/react';
import { CustomTime } from './custom-time';

const Story: Meta<typeof CustomTime> = {
  component: CustomTime,
  title: 'CustomTime',
};
export default Story;

export const Primary = {
  args: {
    pluginKey: '',
    pluginConfigurationSchemaField: {
      required: true,
      defaultValue: '12:00',
      name: 'Label',
      description: 'I am a description',
    },
  },
};
