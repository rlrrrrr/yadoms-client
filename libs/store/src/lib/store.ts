import { configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  AVAILABLE_PLUGINS_FEATURE_KEY,
  availablePluginsReducer,
  PLUGINS_INSTANCES_FEATURE_KEY,
  pluginsInstancesReducer,
} from '@yadoms/domain/plugins';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { KEYWORDS_FEATURE_KEY, keywordsReducer } from '@yadoms/domain/keywords';

export const store = configureStore({
  reducer: {
    [AVAILABLE_PLUGINS_FEATURE_KEY]: availablePluginsReducer,
    [PLUGINS_INSTANCES_FEATURE_KEY]: pluginsInstancesReducer,
    [KEYWORDS_FEATURE_KEY]: keywordsReducer,
  },
  // Additional middleware can be passed to this array
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: !import.meta.env.PROD,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
