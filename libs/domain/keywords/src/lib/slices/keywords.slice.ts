import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { keywordsApi } from '../api/keywords-api';
import { Paging, KeywordsResponse } from '../model/KeywordsResponse';
import { RootState } from '@yadoms/store';

export const KEYWORDS_FEATURE_KEY = 'keywords';

export enum AccessMode {
  Get = 'Get',
  GetSet = 'GetSet',
}
export enum KeywordUnits {
  NoUnit = 'noUnit',
  Ampere = 'ampere',
  AmperePerHOur = 'ampereHour',
  CubicMetre = 'cubicMetre',
  CubicMeterPerSecond = 'cubicMeterPerSecond',
  Decibel = 'decibel',
  DecibelPerMilliWatt = 'decibelPerMilliWatt',
  Degrees = 'degrees',
  DegreesCelcius = 'degreesCelcius',
  DegreesFarenheit = 'degreesFarenheit',
  hectoPascal = 'hectoPascal',
  Hertz = 'hertz',
  Kg = 'kg',
  Lux = 'lux',
  Meter = 'meter',
  MetersPerSecond = 'metersPerSecond',
  Millimeter = 'millimeter',
  MillimeterPerSecond = 'millimeterPerSecond',
  Percent = 'percent',
  Second = 'second',
  Uv = 'uv',
  Volt = 'volt',
  VoltAmpere = 'voltAmpere',
  Watt = 'watt',
  WattPerHour = 'wattPerHour',
  WattPerSquareMeter = 'wattPerSquareMeter',
}
export enum Measure {
  Absolute = 'Absolute',
  Increment = 'Increment',
  Cumulative = 'Cumulative',
}
export enum HistoryDepth {
  Default = 'Default',
  NoHistory = 'NoHistory',
}

export interface KeywordEntity {
  id: number;
  deviceId: number;
  capacityName: string;
  accessMode: AccessMode;
  friendlyName: string;
  type: string;
  units: KeywordUnits;
  typeInfo: object;
  KeywordUnits: Measure;
  detail: object;
  blacklisted: boolean;
  lastAcquisitionValue: string;
  lastAcquisitionDate: string; //TODO remplacer par type de dateTime ?
  historyDepth: HistoryDepth;
}

export interface KeywordsState extends EntityState<KeywordEntity> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error: string | undefined | null;
  paging: Paging;
}

export const KeywordsAdapter = createEntityAdapter<KeywordEntity>();

export const fetchKeywords = createAsyncThunk(
  'keywords/fetch',
  async ({ page, pageSize }: { page: number; pageSize: number }, thunkAPI) => {
    try {
      return await keywordsApi.loadKeywords(page, pageSize);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      } else {
        // Handle other types of errors if needed
        return thunkAPI.rejectWithValue('Unknown error occurred');
      }
    }
  }
);

export const sendKeywordCommand = createAsyncThunk(
  'keywords/command',
  async (
    { keywordId, command }: { keywordId: number; command: string },
    thunkAPI
  ) => {
    try {
      return await keywordsApi.sendCommand(keywordId, command);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      } else {
        // Handle other types of errors if needed
        return thunkAPI.rejectWithValue('Unknown error occurred');
      }
    }
  }
);

export const initialKeywordsInstancesState: KeywordsState =
  KeywordsAdapter.getInitialState({
    loadingStatus: 'not loaded',
    error: null,
    paging: {
      currentPage: 0,
      totalPage: 1,
      pageSize: 10,
    },
  });

export const keywordsSlice = createSlice({
  name: KEYWORDS_FEATURE_KEY,
  initialState: initialKeywordsInstancesState,
  reducers: {
    add: KeywordsAdapter.addOne,
    remove: KeywordsAdapter.removeOne,
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKeywords.pending, (state: KeywordsState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchKeywords.fulfilled,
        (state: KeywordsState, action: PayloadAction<KeywordsResponse>) => {
          KeywordsAdapter.setAll(state, action.payload.keywords);
          state.loadingStatus = 'loaded';
          state.paging = {
            currentPage: action.payload.paging.currentPage,
            totalPage: action.payload.paging.totalPage,
            pageSize: action.payload.paging.pageSize,
          };
        }
      )
      .addCase(fetchKeywords.rejected, (state: KeywordsState, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      });
  },
});

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(pluginsInstancesActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const keywordsActions = keywordsSlice.actions;
export const keywordsReducer = keywordsSlice.reducer;
/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllPluginsInstances);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = KeywordsAdapter.getSelectors();

export const getKeywordsState = (rootState: RootState): KeywordsState =>
  rootState[KEYWORDS_FEATURE_KEY];

export const selectAllKeywords = createSelector(getKeywordsState, selectAll);

export const selectKeywordssEntities = createSelector(
  getKeywordsState,
  selectEntities
);

export const getKeywordsLoadingStatus = createSelector(
  getKeywordsState,
  (state) => state.loadingStatus
);

export const getKeywordsPaging = createSelector(
  getKeywordsState,
  (state) => state.paging
);
