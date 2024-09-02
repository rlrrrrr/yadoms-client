import { Box, Flex, Grid, LoadingOverlay, Paper, Title, Text, Center, Badge } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BreadCrumbs } from '@yadoms/shared';
import { loadSystemInformations } from '../summary-api';
import { useQuery } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { Container } from '@mantine/core';
import semver from 'semver/preload';
import classes from './summary.module.css';
import {
  DatabaseIcon, DatabaseVersionIcon,
  LinuxLogo,
  MacOSLogo,
  PostgreSQLLogo, PowerIcon,
  SQLIcon,
  SQLiteLogo,
  SystemIcon, VersionIcon,
  WindowsLogo,
  SizeIcon
} from './icons';



const customization = {
  Window: {color: "#4057dc", size:40},
  Linux:{color: "#6f706e", size:40},
  MacOs:{color: "#000000", size:40},
  DefaultOs:{color: "#6e6e70", size:40},
  SqLite:{color: "#66b2fc", size:40},
  Postgres:{color: "#3177ff", size:40},
  Database:{color: "#f14809", size:40},
  DatabaseVersion: {color: "#cec483", size:40},
  Power: {color: "#00ff28" ,size:40},
  Version: {color: "#873be1", size:40},
  Size: {color: "#e52121", size:40},
  SQL: {color: "#0048fd", size:40},



}
export function isVersion(version: string) : boolean {
  return semver.valid(version) != null;
}



function formatDate(isoDate: string | undefined): string {
  const {i18n } = useTranslation();
  const locale = i18n.language;
  if (!isoDate) {
    return '';
  }

  const year = parseInt(isoDate.slice(0, 4), 10);
  const month = parseInt(isoDate.slice(4, 6), 10) - 1;
  const day = parseInt(isoDate.slice(6, 8), 10);
  const hour = parseInt(isoDate.slice(9, 11), 10);
  const minute = parseInt(isoDate.slice(11, 13), 10);
  const second = parseInt(isoDate.slice(13, 15), 10);
  const millisecond = Math.round(parseFloat("0." + isoDate.split('.')[1]) * 1000);

  const date = new Date(year, month, day, hour, minute, second, millisecond);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
  };

  return date.toLocaleDateString(locale, options);

}

export function Card({ icon, label, content, color}: {
  icon: ReactNode,
  label: string,
  content: string | number | undefined
  color:string
}) {
  return (
    <Paper mih={150}  p={'xs'} withBorder className={classes.item} styles={(theme) => ({
      root: {
        boxShadow: `0px 0px 20px ${color}`,
        border: `1px solid ${color}`
      },
    })}>
      <Center>
        {icon}
      </Center>
      <Text
        weight={500}
        size={{base: 'xs', sm: 'lg' }}
      >
        {label}
      </Text>
      {isVersion(content) ? (
        <Badge color="pink" variant="light" mt="md">
          <Text
            size={{base: 'xs', sm: 'lg' }}
          >
            {content}
          </Text>
        </Badge>
      ) : (
        <Text
          size={{base: 'xs', sm: 'lg' }}
        >
          {
            Number.isInteger(content) ? `${content} Octets` : content
          }
        </Text>
      )}
    </Paper>
  );
}

export function FeaturesGrid({ systemInformations }: { systemInformations: SystemInformation[] }) {
  const { t } = useTranslation();
  return (
    <div >
      <Container fluid >
      <Flex direction={{ base: 'column', sm: 'row' }} justify={{ sm: 'center' }} gap={{ base: 'xs', sm: 'lg' }}  mih={150} miw={150} mah={150}>
        <Grid gutter="lg">
          {systemInformations.map((element) => (
            <Grid.Col span={4}
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3} >
              <Card icon={element.icon} label={t(`summary.informations.${element.i18nKey}`)}
                    content={element.dataKey} color={element.color} ></Card>
            </Grid.Col>
          ))}
        </Grid>
      </Flex>
      </Container>
    </div>
  );
}


type SystemInformation = {
  i18nKey: string;
  dataKey: string | number | undefined;
  icon: ReactNode;
  color: string
};

export function Summary() {

  const { t } = useTranslation();
  const { isLoading, data } = useQuery({
    queryKey: ['system-informations'],
    queryFn: loadSystemInformations,
  });

  const breadcrumbsItem = [
    { title: 'home', href: '/' },
    { title: 'summary', href: '/summary' },
  ];

  const getPlatformIcon = (platform: string | undefined) => {
    if (!platform) return <SystemIcon size={customization.DefaultOs.size} color={customization.DefaultOs.color} />;;

    if (platform.startsWith('Windows')) {
      return <WindowsLogo size={customization.Window.size} color={customization.Window.color} />;
    } else if (platform.startsWith('Linux')) {
      return <LinuxLogo size={customization.Linux.size} color={customization.Linux.color} />;
    } else if (platform.startsWith('MacOs')) {
      return <MacOSLogo size={customization.MacOs.size} color={customization.MacOs.color} />;
    } else {
      return <SystemIcon size={customization.DefaultOs.size} color={customization.DefaultOs.color} />;
    }
  };


  const getDatabaseEngineIcon = (engine: string | undefined) => {
    switch (engine) {
      case 'SQLite':
        return <SQLiteLogo size={customization.SqLite.size} color={customization.SqLite.color} />;
      case 'Postgres':
        return <PostgreSQLLogo size={customization.Postgres.size} color={customization.Postgres.color} />;
      default:
        return <SQLIcon size={customization.SQL.color} color={customization.SQL.color}/>;
    }
  };


  const systemInformations = [
    { i18nKey: 'platform', dataKey: data?.platform, icon: getPlatformIcon(data?.platform), color: customization.DefaultOs.color},
    { i18nKey: 'software-version', dataKey: data?.yadomsVersion, icon: <VersionIcon size={40} color={customization.Version.color} />, color: customization.Version.color },
    {
      i18nKey: 'database-version',
      dataKey: data?.database.version,
      icon: <DatabaseVersionIcon size={customization.DatabaseVersion.size} color={customization.DatabaseVersion.color} />,
      color: customization.DatabaseVersion.color
    },
    {
      i18nKey: 'started-from',
      dataKey: formatDate(data?.startupTime),
      icon: <PowerIcon size={customization.Power.size} color={customization.Power.color} />,
      color: customization.Power.color
    },
    {
      i18nKey: 'database-engine',
      dataKey: data?.databaseEngine.type,
      icon: getDatabaseEngineIcon(data?.databaseEngine.type),
      color: customization.SQL.color
    },
    {
      i18nKey: 'version-database-engine',
      dataKey: data?.databaseEngine.version,
      icon: <DatabaseIcon size={customization.Database.size} color={customization.Database.color} />,
      color: customization.Database.color
    },
    { i18nKey: 'database-size', dataKey: data?.database.size, icon: <SizeIcon size={customization.Size.size} color={customization.Size.color} />, color: customization.Size.color},
  ];

  return (
    <Flex direction={'column'}>
      <BreadCrumbs breadcrumbsItems={breadcrumbsItem} />
      <Title order={3} size="h3" mt="md">
        {t('summary.home.description')}
      </Title>
      <Box maw={'100%'} pos="relative" pt={'20px'}>
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
          <FeaturesGrid systemInformations={systemInformations}></FeaturesGrid>
      </Box>
    </Flex>
  );

}


export default Summary;
