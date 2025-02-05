import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  Image,
  Skeleton,
  Title,
  useMantineTheme
} from '@mantine/core';
import { IconHomePlus, IconHomeSearch, IconPencil, IconPower, IconTrash } from '@tabler/icons-react';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextInput,
  MRT_Icons,
  MRT_Row,
  MRT_TableInstance,
  MRT_VisibilityState,
  useMantineReactTable
} from 'mantine-react-table';
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import CreateNewPlugin from '../create-new-plugin/create-new-plugin';
import { BreadCrumbs, openDeleteModal } from '@yadoms/shared';
import { useTranslation } from 'react-i18next';
import {
  fetchPluginsInstances,
  getPluginsInstancesLoadingStatus,
  getPluginsInstancesPaging,
  PluginsInstancesEntity,
  PuginsInstancesState,
  selectAllPluginsInstances,
  startStopPluginsInstance,
  updatePluginsInstance
} from '@yadoms/domain/plugins';
import { useAppDispatch, useAppSelector } from '@yadoms/store';
import classes from './plugins.module.css';

/* eslint-disable-next-line */
export interface PluginsProps {}

export const stateColors: Record<string, string> = {
  unknown: 'yellow',
  error: 'red',
  stopped: 'blue',
  running: 'green',
  custom: 'yellow',
  waitdebugger: 'yellow',
};

export type Plugin = {
  id: string;
  avatar: string;
  name: string;
  automaticStartup: boolean;
  state: 'stopped';
};

export function Plugins(props: PluginsProps) {
  const dispatch = useAppDispatch();
  const pluginsInstancesEntities = useAppSelector(selectAllPluginsInstances);
  const loadingStatus = useAppSelector(getPluginsInstancesLoadingStatus);
  const paging = useAppSelector(getPluginsInstancesPaging);

  //we need a table instance ref to pass as a prop to the MRT Toolbar buttons
  const tableInstanceRef =
    useRef<MRT_TableInstance<PluginsInstancesEntity> | null>(null);

  //we will also need some weird re-render hacks to force the MRT_ components to re-render since ref changes do not trigger a re-render
  const rerender = useReducer(() => ({}), {})[1];

  //we need to manage the state that should trigger the MRT_ components in our custom toolbar to re-render
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {}
  );

  const { t } = useTranslation();

  //optionally, you can manage the row selection state yourself
  const [data, setData] = useState<PluginsInstancesEntity[]>(
    () => pluginsInstancesEntities
  );

  const setTableDataMemoized = useCallback(setData, [setData]);

  useEffect(() => {
    dispatch(fetchPluginsInstances({ page: 0, pageSize: 10 }));
  }, [dispatch, setTableDataMemoized]);

  useEffect(() => {
    setTableDataMemoized(pluginsInstancesEntities);
  }, [pluginsInstancesEntities, setTableDataMemoized]);

  const handleAutostartCheckboxChange = useCallback(
    async (
      row: MRT_Row<PluginsInstancesEntity>,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      dispatch(
        updatePluginsInstance({
          id: row.original.id,
          data: { autoStart: event.target.checked },
        })
      );
    },
    [dispatch]
  );

  const handleTogglePowerRow = useCallback(
    async (row: MRT_Row<PluginsInstancesEntity>) => {
      dispatch(
        startStopPluginsInstance({
          id: row.original.id,
          start:
            row.original.state === PuginsInstancesState.Stopped ||
            row.original.state === PuginsInstancesState.Error,
        })
      );
    },
    [dispatch]
  );

  const theme = useMantineTheme();

  const columns = useMemo<MRT_ColumnDef<PluginsInstancesEntity>[]>(
    () => [
      {
        accessorKey: 'type',
        header: t('plugins.home.type'),
        enableColumnOrdering: true, //but you can turn back any of those features on if you want like this
        Cell: ({ row }) => (
          <Image
            width={120}
            height={50}
            fit="contain"
            src={
              'http://localhost:8080/rest/v2/plugins?byType=' +
              row.original.type +
              '&prop=icon'
            }
            alt="With default placeholder"
            withPlaceholder
          />
        ),
      },
      {
        accessorKey: 'displayName',
        header: t('plugins.home.name'),
      },
      {
        accessorKey: 'autoStart',
        header: t('plugins.home.start-automatically'),
        //columnDefType: 'display', //turns off data column features like sorting, filtering, etc.
        enableColumnOrdering: true, //but you can turn back any of those features on if you want like this
        Cell: ({ row }) => (
          <Checkbox
            size="sm"
            color="dimmed"
            defaultChecked={row.original.autoStart}
            onChange={(event) => handleAutostartCheckboxChange(row, event)}
          />
        ),
      },
      {
        accessorKey: 'state',
        header: t('plugins.home.state'),
        // columnDefType: 'display', //turns off data column features like sorting, filtering, etc.
        // enableColumnOrdering: false, //but you can turn back any of those features on if you want like this
        Cell: ({ row }) => (
          <Badge
            color={stateColors[row.original.state.toLowerCase()]}
            variant={theme.colorScheme === 'dark' ? 'light' : 'dot'}
          >
            {row.original.state}
          </Badge>
        ),
      },
    ],
    [handleAutostartCheckboxChange, t, theme.colorScheme] //end
  );

  const handleDeleteRow = useCallback(
    async (row: MRT_Row<PluginsInstancesEntity>) => {
      const confirmed = await openDeleteModal();
      if (!confirmed) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      data.splice(row.index, 1);
      setData([...data]);
    },
    [data]
  );

  const [isCreatePluginModelOpened, setCreatePluginModelOpened] =
    useState(false);

  function handleModalClose() {
    setCreatePluginModelOpened(false);
    // Vous pouvez faire ce que vous voulez après la fermeture de la modal
  }

  const breadcrumbsItem = [
    { title: 'home', href: '#' },
    { title: 'plugins', href: '#' },
  ];

  const faIcons: Partial<MRT_Icons> = {
    //change sort icon, connect internal props so that it gets styled correctly
    IconSearch: () => <IconHomeSearch />,
  };
  const table = useMantineReactTable({
    columns: columns,
    data,
    enableEditing: true,
    enableColumnOrdering: true,
    positionActionsColumn: 'last',
    enableTopToolbar: true,
    enableToolbarInternalActions: false,
    initialState: {
      showGlobalFilter: true, //show the global filter by default
    },
    icons: faIcons,

    renderRowActions: ({ table, row }) => (
      <Group spacing={3} position="center">
        <ActionIcon onClick={() => handleTogglePowerRow(row)}>
          <IconPower size={30} stroke={1.5} />
        </ActionIcon>
        <ActionIcon onClick={() => table.setEditingRow(row)}>
          <IconPencil size={30} stroke={1.5} />
        </ActionIcon>
        <ActionIcon color="red" onClick={() => handleDeleteRow(row)}>
          <IconTrash size={30} stroke={1.5} />
        </ActionIcon>
      </Group>
    ),
    renderTopToolbar: ({ table }) => (
      <Flex className={classes.flex}>
        <MRT_GlobalFilterTextInput table={table} />
        <Box>
          <Button
            leftSection={<IconHomePlus />}
            onClick={() => setCreatePluginModelOpened(true)}
          >
            {t('plugins.home.create-new-plugin-btn')}
          </Button>
        </Box>
      </Flex>
    ),
  });

  return (
    <Flex direction="column">
      <BreadCrumbs breadcrumbsItems={breadcrumbsItem} />

      <Title order={3} size="h3" m="md">
        {t('plugins.home.description')}
      </Title>

      {isCreatePluginModelOpened && (
        <CreateNewPlugin
          opened={isCreatePluginModelOpened}
          onClose={handleModalClose}
        />
      )}

      <Skeleton visible={loadingStatus === 'loading'}>
        <MantineReactTable table={table} />
      </Skeleton>
    </Flex>
  );
}

export default Plugins;
