import { useGlobal } from 'reactn';
import GlassX from './core';
import { State } from './../@types/core';
import { SetStoreFn, Reducer } from './../@types/functions';
import { SetStateAction } from 'react';

export function useStore<StateType = any>(): [State, SetStoreFn<State>];
export function useStore<StateType = any>(
  item: string
): [StateType, SetStoreFn<StateType>];

export function useStore<StateType = any>(
  item?: string
): [StateType, SetStoreFn<StateType>] {
  const [state, setState] = useGlobal<any, any>(item);

  const stateSetter: SetStoreFn<StateType> = value => {
    let localState = {};

    if (typeof value === 'function') {
      const callableState = value as (prevState: StateType) => State;
      const finalState = callableState(state);
      localState = finalState;

      setState(finalState);
    } else {
      localState = item ? { ...state, [item]: value } : { ...state, ...value };
      setState(value);
    }

    GlassX.applyPluginHook('onSave', localState);
  };

  return [state, stateSetter];
}

export function useReducer<PayloadType = any>(
  reducer: string | Reducer<State>
) {
  return GlassX.useReducer<PayloadType>(reducer);
}

export function setStore<StateType extends State = State>(
  item: SetStateAction<StateType>
) {
  return GlassX.set(item);
}
