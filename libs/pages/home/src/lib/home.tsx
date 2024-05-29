import { useContext } from "react";
import { YadomsConnectionContext, YadomsConnection } from 'libs/shared/src/lib/services/YadomsWebSocketConnection'
import KeywordLog from "./widgets/ybutton";

/* eslint-disable-next-line */
export interface PagesHomeProps { }


export function Home(props: PagesHomeProps) {
  const { connected, serverCurrentTime } = useContext(YadomsConnectionContext) as YadomsConnection;

  return (
    <div>
      <h1>Welcome to PagesHome!</h1>
      <p>Socket is {connected ? "connected" : "DISCONNECTED"}</p>
      <p>Server current time is {serverCurrentTime?.toString()}</p>
      <KeywordLog widgetId={1} keywordsToListen={"45,46"}></KeywordLog>
      <KeywordLog widgetId={2} keywordsToListen={"24, 25, 26"}></KeywordLog>
    </div>
  );
}

export default Home;
