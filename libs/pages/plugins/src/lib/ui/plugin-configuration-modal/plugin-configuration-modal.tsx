import {
  Button,
  Flex,
  Modal,
  ScrollArea,
  Space,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateForm } from './plugins-configuration-forms';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import renderPluginField from '../render-plugin-field/render-plugin-field';
import {
  getFromInitialValuesTest,
  getInitialValues,
  PluginConfigurationSchema,
} from '@yadoms/domain/plugins';
import classes from './plugin-configuration-modal.module.css';

export interface PluginConfigurationModalProps {
  opened: boolean;
  onClose: () => void;
  selectedPluginConfigurationSchema: PluginConfigurationSchema;
  selectedPluginType: string;
  onCloseAllModals: () => void;
}

export interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label?: string;
  value: string;
  description?: string;
}

export function PluginConfigurationModal(props: PluginConfigurationModalProps) {
  const theme = useMantineTheme();
  const { t } = useTranslation();

  const [initialValues, setInitialValues] = useState(
    getInitialValues({
      type: props.selectedPluginType,
      displayName: '',
      configurationSchema: props.selectedPluginConfigurationSchema,
    })
  );

  useEffect(() => {
    setInitialValues(
      getInitialValues({
        type: props.selectedPluginType,
        displayName: '',
        configurationSchema: props.selectedPluginConfigurationSchema,
      })
    );
  }, [props.selectedPluginType, props.selectedPluginConfigurationSchema]);
  const form = useForm({
    initialValues,
    validate: (values) => validateForm(values),
  });

  const handleClose = () => {
    form.reset();
    props.onClose();
  };

  return (
    <Modal.Root
      onClose={handleClose}
      opened={props.opened}
      size="95%"
      zIndex={1000}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Modal.Overlay opacity={0.55} blur={3} />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            {t('plugins.modal.plugin-configuration.title')}
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={form.onSubmit(
              (values, event) => {
                console.log(
                  values, // <- form.getValues() at the moment of submit
                  event // <- form element submit event
                );
                notifications.show({
                  title: 'Form submitted',
                  message: 'Your form has been submitted successfully.',
                  color: theme.colors.green[6],
                  position: 'bottom-right',
                });
              },
              (validationErrors, values, event) => {
                form.validate();
                console.log(
                  'failed',
                  validationErrors, // <- form.errors at the moment of submit
                  values, // <- form.getValues() at the moment of submit
                  event // <- form element submit event
                );
                notifications.show({
                  title: 'Validation error',
                  message: 'Please fix the errors in the form and try again.',
                  color: 'red',
                });
              }
            )}
          >
            <Flex direction={'column'} gap={10}>
              <TextInput
                label="Name"
                placeholder="Plugin name"
                defaultValue={props.selectedPluginType}
                description="custom plugin Name"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                withAsterisk
              />
              {getFromInitialValuesTest(
                props.selectedPluginConfigurationSchema
              ).map(({ key, path, field }) =>
                renderPluginField({
                  field: field,
                  path: path,
                  pluginKey: key,
                  form: form,
                })
              )}
              {renderSpacing(6)}
            </Flex>

            <Flex
              className={classes.modalFooter}
              mih={50}
              gap="xs"
              justify="flex-end"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <Button onClick={handleClose} variant={'outline'}>
                {t('plugins.modal.plugin-configuration.back')}
              </Button>
              <Button type="submit" disabled={false}>
                {t('plugins.modal.plugin-configuration.create')}
              </Button>
            </Flex>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

function renderSpacing(numberOfSpace: number): React.ReactNode {
  const spaces = [];

  for (let i = 0; i < numberOfSpace; i++) {
    spaces.push(<Space key={i} w="xl" />);
  }

  return spaces;
}

export default PluginConfigurationModal;
