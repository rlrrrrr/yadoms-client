import { useContext } from "react";
import { MyThemeContext, MyThemeType, ThemeValues } from 'libs/shared/src/lib/services/YadomsWebSocketConnection'

/* eslint-disable-next-line */
export interface PagesHomeProps { }

export function Home(props: PagesHomeProps) {
  const { theme, changeTheme, connected, filterAcquisitions } = useContext(MyThemeContext) as MyThemeType;

  function updateTheme(newThemeValue: ThemeValues) {
    changeTheme({ value: newThemeValue });
  }

  return (
    <div>
      <h1>Welcome to PagesHome!</h1>
      <p>The current theme is {theme.value}.</p>
      <button
        onClick={() => {
          updateTheme(theme.value == "light" ? "dark" : "light")
        }}>
        Bouton
      </button>
      <p>Socket is {connected ? "connected" : "DISCONNECTED"}</p>
      <button
        onClick={() => {
          filterAcquisitions([44, 45, 46]);
        }}>
        Filter acquisitions
      </button>
    </div>
  );
}

export default Home;
