import { useContext, useEffect, useState } from "react";
import { YadomsConnectionContext, YadomsConnection } from 'libs/shared/src/lib/services/YadomsWebSocketConnection'
import { v4 as uuidv4 } from "uuid";
import KeywordLog from "./widgets/ybutton";

/* eslint-disable-next-line */
export interface PagesHomeProps { }


export interface WidgetsProps { // TODO déplacer
  widgetId: number;
}


export function Home(props: PagesHomeProps) {
  const { connected, serverCurrentTime } = useContext(YadomsConnectionContext) as YadomsConnection;

  return (
    <div>
      <h1>Welcome to PagesHome!</h1>
      <p>Socket is {connected ? "connected" : "DISCONNECTED"}</p>
      <p>Server current time is {serverCurrentTime?.toString()}</p>
      <KeywordLog widgetId={1}></KeywordLog>
      <KeywordLog widgetId={2}></KeywordLog>
    </div>
  );
}

export default Home;
