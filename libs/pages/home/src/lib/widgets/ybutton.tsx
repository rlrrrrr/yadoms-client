import { useContext, useEffect, useState } from "react";
import { YadomsConnectionContext, YadomsConnection, Acquisition } from 'libs/shared/src/lib/services/YadomsWebSocketConnection'
import { v4 as uuidv4 } from "uuid";
import { Button, TextInput } from '@mantine/core';
import { WidgetsProps } from "../home"; //TODO juste nécessaire pour WidgetsProps, réduire le scope


/* eslint-disable-next-line */
export interface KeywordLogProps extends WidgetsProps {
}

export function KeywordLog(props: KeywordLogProps) {
  const { subscribeToKeywordAcquisitions } = useContext(YadomsConnectionContext) as YadomsConnection;
  const [myAcquisitions, setMyAcquisitions] = useState<Acquisition[]>([]);

  const [keywordsToListen, setKeywordsToListen] = useState('45, 46');
  function parseKeywordsToListen(value: string): number[] {
    return value.split(',').map(element => {
      return parseInt(element, 10);
    });
  }

  function onNewAcquisition(newAcquisition: Acquisition): void {
    console.log("yButton #" + props.widgetId + ", kwd #" + newAcquisition.keyword + " [" + newAcquisition.date + "] = " + newAcquisition.value);
    setMyAcquisitions(myAcquisitions => [newAcquisition, ...myAcquisitions].slice(0, 4));
  }

  function applyKeywordsToListen(): void {
    subscribeToKeywordAcquisitions(parseKeywordsToListen(keywordsToListen), onNewAcquisition);
  }

  useEffect(() => {
    applyKeywordsToListen();
  }, []);

  return (
    <div>
      <h2>yButton #{props.widgetId}</h2>
      <TextInput
        data-autofocus
        label='Select keywords to listen (comma separated)'
        value={keywordsToListen.toString()}
        onChange={(event) => setKeywordsToListen(event.currentTarget.value)}
      />
      <Button onClick={applyKeywordsToListen} type="submit">
        Apply
      </Button>
      {myAcquisitions
        .map(acq => <p key={uuidv4()}>[{acq.date.toLocaleTimeString()}] kwd #{acq.keyword} = {acq.value}</p>)}
    </div>
  );
}

export default KeywordLog;
