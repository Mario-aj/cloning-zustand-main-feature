import { useSyncExternalStore } from "react";

type Selector<T, U> = (state: T) => U;
type Initializer<T> = (set: SetState<T>, get: () => T) => T;
type SetState<T> = (newState: Partial<T> | ((state: T) => Partial<T>)) => void;

export function create<T>(initFunction: Initializer<T>) {
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

  state = initFunction(setState, getState);

  const useStore = <U = T>(selector?: Selector<T, U>): U => {
    return useSyncExternalStore<U>(
      (callback) => {
        listeners.add(callback);

        return () => {
          listeners.delete(callback);
        };
      },
      () => (selector ? selector(getState()) : getState()) as U,
      () => (selector ? selector(getState()) : getState()) as U
    ) as U;
  };

  return useStore;
}
