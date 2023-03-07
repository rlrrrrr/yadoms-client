import {
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  Modal,
  Select,
  Stepper,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import PluginConfiguration from '../plugin-configuration/plugin-configuration';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAvailablePlugins,
  getAvailablePluginsState,
  selectAllAvailablePlugins,
} from '../../redux/available-plugins.slice';

export interface CreateNewPluginModalProps {
  opened: boolean;
  onClose: () => void;
}

export const configurationSchema = {
  Name: {
    type: 'string',
    required: true,
    description: 'Plugin custom name',
  },
  Port: {
    type: 'int',
    required: true,
    defaultValue: 80,
  },
  authentication: {
    type: 'section',
    enableWithCheckBox: true,
    checkbox: {
      defaultValue: true,
    },
    content: {
      Password: {
        type: 'string',
        encrypted: true,
        required: true,
      },
    },
  },
};
export function CreateNewPluginModal(props: CreateNewPluginModalProps) {
  const dispatch = useDispatch();
  const availablePluginsEntities = useSelector(selectAllAvailablePlugins);
  const loadingStatus = useSelector(getAvailablePluginsState);

  useEffect(() => {
    dispatch(fetchAvailablePlugins());
  }, [dispatch]);

  const STEPPER_LENGTH = 2;
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(props.opened);

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < STEPPER_LENGTH ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  function isFirstStep() {
    return active !== 0;
  }

  function isLastStep() {
    return active !== STEPPER_LENGTH;
  }
  function generatePluginsGrid() {
    console.log(availablePluginsEntities);
    return availablePluginsEntities.map((availablePluginsEntity) => (
      <Grid.Col span={4} key={`col-${availablePluginsEntity.id}`}>
        <Card
          sx={{ cursor: 'pointer' }}
          shadow="sm"
          p="xl"
          component="a"
          onClick={nextStep}
          target="_blank"
        >
          <Card.Section>
            <Image
              src={`http://localhost:8080/rest/v2/plugins?byType=${availablePluginsEntity.type}&prop=icon`}
              height={160}
              fit="contain"
              alt="No way!"
            />
          </Card.Section>

          <Group position="apart" mt="md">
            <Text fw={700}>{availablePluginsEntity.type}</Text>
            <Badge color="pink" variant="light">
              v{availablePluginsEntity.version}
            </Badge>
          </Group>

          <Text mt="xs" color="dimmed" size="sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat,
            quod.
          </Text>
          <Flex justify={'flex-end'} mt="xs">
            <Text fz="xs" c="dimmed">
              by {availablePluginsEntity.author}
            </Text>
          </Flex>
        </Card>
      </Grid.Col>
    ));
  }

  return (
    <Modal
      overlayColor={
        theme.colorScheme === 'dark'
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      onClose={props.onClose}
      opened
      fullScreen
      overflow="inside"
      title={
        <Group position="left">
          {isFirstStep() && (
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
          )}
          {isFirstStep() && <Button onClick={nextStep}>Next step</Button>}
        </Group>
      }
    >
      <Stepper
        active={active}
        onStepClick={setActive}
        breakpoint="sm"
        px={'10px'}
      >
        <Stepper.Step label="Choose your plugin">
          <Container fluid>
            <Grid justify="center">{generatePluginsGrid()}</Grid>
          </Container>
        </Stepper.Step>
        <Stepper.Step label="Configuration" loading={true}>
          <PluginConfiguration configurationSchema={configurationSchema} />
          <TextInput
            label="Name"
            placeholder="Plugin name"
            description="Plugin custom name"
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            withAsterisk
          />

          <Select
            data={['serial0', 'serial1', 'serial2', 'serial3']}
            placeholder="Pick one"
            label="Serial port"
            description="The (virtual) serial port connected to the EnOcean USB stick"
            withAsterisk
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            mt="md"
          />

          <Select
            data={['automatic', 'Manual']}
            placeholder="Pick one"
            label="Pairing mode"
            description="The pairing mode can be automatic (each new device detected is saved automatically), or manual via a command on the plugin (green button)"
            withAsterisk
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            mt="md"
          />
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>
    </Modal>
  );
}

export default CreateNewPluginModal;
