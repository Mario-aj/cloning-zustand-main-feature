import { useCallback, useSyncExternalStore } from "react";

export type Selector<T, U> = (state: T) => U;
export type Initializer<T> = (set: SetState<T>, get: () => T) => T;
export type SetState<T> = (
  newState: Partial<T> | ((state: T) => Partial<T>)
) => void;

function createStoreApi<T>(initFunction: Initializer<T>) {
  let state: T = {} as T;
  const listeners = new Set<VoidFunction>();

  const setState: SetState<T> = (newState) => {
    if (typeof newState === "function") {
      state = { ...state, ...newState(state) };
    } else {
      state = { ...state, ...newState };
    }
    listeners.forEach((listener) => listener());
  };

  const getState = () => state;

  const subscribe = (callback: VoidFunction) => {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  };

  const getSnapshot = <U>(selector: Selector<T, U>) => selector(getState());

  state = initFunction(setState, getState);

  return {
    setState,
    getState,
    subscribe,
    getSnapshot,
  };
}

export function create<T>(initFunction: Initializer<T>) {
  const storeApi = createStoreApi(initFunction);

  return function useStore<U>(selector: Selector<T, U>) {
    return useSyncExternalStore(
      storeApi.subscribe,
      useCallback(() => storeApi.getSnapshot(selector), [selector]),
      useCallback(() => storeApi.getSnapshot(selector), [selector])
    );
  };
}
