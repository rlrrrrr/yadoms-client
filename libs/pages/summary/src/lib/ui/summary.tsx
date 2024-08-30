import {Box, Flex, Grid,LoadingOverlay, Paper, Title, Text, Center} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BreadCrumbs } from '@yadoms/shared';
import { loadSystemInformations } from '../summary-api';
import { useQuery } from '@tanstack/react-query';
import { SiSqlite, SiPostgresql, SiMysql, SiMongodb, SiRedis} from "react-icons/si";
import { DiWindows, DiLinux, DiApple, DiDatabase} from "react-icons/di";
import { ReactNode } from 'react';
import {GrDatabase } from "react-icons/gr";
import { MdOutlineNewReleases,MdElectricBolt } from "react-icons/md";
import { IoResize } from "react-icons/io5";
import { TbTimeDurationOff } from "react-icons/tb";
import { GrSystem } from "react-icons/gr";
import {  Container} from '@mantine/core';


export function Card({icon,label, content}:{icon: ReactNode, label:string, content: string | number | undefined}){
    return (
  <Grid.Col span={4}>

          <Paper withBorder shadow="md" p="md">
            <Center>
              {icon}
            </Center>
            <Text  mt="md">
              {label}
            </Text>
            <Text  size="sm">
              {content}
            </Text>
          </Paper>
        </Grid.Col>
  )
}

function formatDate(isoDate: string | undefined): string {

  if(!isoDate){
    return ""
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

  return date.toLocaleDateString('fr-FR', options);

}


export function FeaturesGrid({systemInformations}:{systemInformations:SystemInformation[]}) {
  const { t } = useTranslation();
  return (
    <Container size="lg" py="xl">
      <Grid gutter="lg">
        {systemInformations.map((element) => (
          <Card icon={element.icon} label={t(`summary.informations.${element.i18nKey}`)} content={element.dataKey} key={element.dataKey}></Card>
        ))}
      </Grid>
    </Container>
  );
}

type SystemInformation = {
  i18nKey: string;
  dataKey: string | number | undefined;
  icon: ReactNode;
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
    if (!platform) return <GrSystem />;
  
    if (platform.startsWith('Windows')) {
      return <DiWindows size={40}/>;
    } else if (platform.startsWith('Linux')) {
      return <DiLinux size={40}/>;
    } else if (platform.startsWith('MacOs')) {
      return <DiApple size={40}/>;
    } else {
      return <GrSystem size={40}/>;
    }
  };
  
  
  const getDatabaseEngineIcon = (engine: string | undefined) => {
    switch (engine) {
      case 'SQLite':
        return <SiSqlite size={40}/>;
      case 'Postgres':
        return <SiPostgresql size={40}/>;
      default:
        return <DiDatabase size={40}/>;
    }
  };
  

  
  const systemInformations = [
    { i18nKey: 'platform', dataKey: data?.platform, icon: getPlatformIcon(data?.platform)},
    { i18nKey: 'software-version', dataKey: data?.yadomsVersion, icon: <MdOutlineNewReleases size={40}/>}, 
    { i18nKey: 'database-version', dataKey: data?.database.version, icon: <GrDatabase size={40} /> },
    { i18nKey: 'started-from', dataKey: formatDate(data?.startupTime), icon:<MdElectricBolt size={40}/> }, 
    { i18nKey: 'database-engine', dataKey: data?.databaseEngine.type, icon: getDatabaseEngineIcon(data?.databaseEngine.type) },
    {
      i18nKey: 'version-database-engine',
      dataKey: data?.databaseEngine.version,
      icon: <TbTimeDurationOff size={40}/>
    },
    { i18nKey: 'database-size', dataKey: data?.database.size, icon: <IoResize size={40} /> },
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
        <Paper shadow="xs" p="md">
          <FeaturesGrid systemInformations={systemInformations}></FeaturesGrid>
        </Paper>
      </Box>
    </Flex>
  );
  
}
  

export default Summary;
