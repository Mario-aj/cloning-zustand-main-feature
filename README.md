# Zustand Clone - Minimal State Management

A lightweight, educational implementation of Zustand's core state management functionality. This project recreates the essential features of Zustand to demonstrate how modern React state management works under the hood.

## 🎯 Features

- **Minimal API**: Simple and intuitive state management with just one main function
- **React 19 Compatible**: Built with React's `useSyncExternalStore` hook
- **TypeScript First**: Fully typed with excellent type inference
- **Selective Subscriptions**: Components only re-render when their selected state changes
- **Functional Updates**: Support for both direct state updates and functional updates
- **Zero Dependencies**: Core implementation uses only React (no external state management libraries)

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd cloning-zustand-core-feature

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

## 🚀 Quick Start

### 1. Create a Store

Define your store with an initializer function that receives `set` and `get` helpers:

```typescript
import { create } from "./lib";

interface CountStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCountStore = create<CountStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

### 2. Use the Store in Components

Select only the state you need using a selector function:

```typescript
import { useCountStore } from "./store/countStore";

export const Counter = () => {
  const count = useCountStore((state) => state.count);
  
  return <h2>{count}</h2>;
};

export const IncrementButton = () => {
  const increment = useCountStore((state) => state.increment);
  
  return <button onClick={increment}>+</button>;
};
```

## 📚 API Reference

### `create<T>(initializer)`

Creates a store hook with the given initializer function.

**Parameters:**
- `initializer: (set: SetState<T>, get: () => T) => T` - A function that returns the initial state and receives:
  - `set` - Function to update the state
  - `get` - Function to get the current state

**Returns:**
- `useStore<U>(selector: (state: T) => U) => U` - A React hook that accepts a selector

**Example:**

```typescript
const useStore = create<State>((set, get) => ({
  value: 0,
  increment: () => set({ value: get().value + 1 }),
  // Or using functional update
  decrement: () => set((state) => ({ value: state.value - 1 })),
}));
```

### `set(updater)`

Updates the store state. Can be called with a partial state object or an updater function.

**Parameters:**
- `updater: Partial<T> | ((state: T) => Partial<T>)` - New state or updater function

**Examples:**

```typescript
// Direct update
set({ count: 5 });

// Functional update
set((state) => ({ count: state.count + 1 }));
```

### `get()`

Returns the current state of the store.

**Returns:**
- `T` - The current state

**Example:**

```typescript
const currentState = get();
console.log(currentState.count);
```

## 🔍 How It Works

### Core Architecture

This implementation uses three key React concepts:

1. **External Store Pattern**: State is stored outside React's component tree
2. **useSyncExternalStore**: React 18+ hook for subscribing to external stores
3. **Pub/Sub Pattern**: Listeners are notified when state changes

### Implementation Details

```typescript
// 1. Store API manages state and subscriptions
function createStoreApi<T>(initFunction: Initializer<T>) {
  let state: T = {} as T;
  const listeners = new Set<VoidFunction>();

  const setState: SetState<T> = (newState) => {
    // Merge new state with existing state
    if (typeof newState === "function") {
      state = { ...state, ...newState(state) };
    } else {
      state = { ...state, ...newState };
    }
    // Notify all subscribers
    listeners.forEach((listener) => listener());
  };

  const subscribe = (callback: VoidFunction) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };

  // Initialize state
  state = initFunction(setState, getState);

  return { setState, getState, subscribe, getSnapshot };
}

// 2. Hook creation connects React to the store
export function create<T>(initFunction: Initializer<T>) {
  const storeApi = createStoreApi(initFunction);

  return function useStore<U>(selector: Selector<T, U>) {
    return useSyncExternalStore(
      storeApi.subscribe,
      () => storeApi.getSnapshot(selector),
      () => storeApi.getSnapshot(selector)
    );
  };
}
```

### Key Features Explained

**Selective Subscriptions**
Components only re-render when their selected slice of state changes:

```typescript
// This component only re-renders when count changes
const count = useCountStore((state) => state.count);

// This component never re-renders (functions are stable)
const increment = useCountStore((state) => state.increment);
```

**Functional Updates**
You can update state based on the previous state:

```typescript
// Using get()
increment: () => set({ count: get().count + 1 })

// Using functional update (recommended)
increment: () => set((state) => ({ count: state.count + 1 }))
```

## 🎓 Learning Resources

This implementation demonstrates several important concepts:

- **External Store Management**: How to manage state outside React's component tree
- **Pub/Sub Pattern**: How to implement the observer pattern for state updates
- **React 18+ Features**: How `useSyncExternalStore` enables external state management
- **TypeScript Generics**: How to create type-safe, flexible APIs

## 🛠️ Project Structure

```
src/
├── lib/
│   └── index.ts          # Core state management implementation
├── store/
│   └── countStore.ts     # Example store definition
├── components/
│   └── Counter/
│       ├── index.tsx
│       ├── IncrementButton.tsx
│       ├── DecrementButton.tsx
│       └── resetButton.tsx
└── App.tsx               # Demo application
```

## 🆚 Differences from Original Zustand

This clone focuses on core functionality and intentionally omits:

- Middleware support (persist, devtools, immer)
- Vanilla store API
- Shallow equality checks
- Context-based stores
- Computed values / derived state

These features can be added as learning exercises!

## 🧪 Example Use Cases

### Counter (Included)

```typescript
const useCountStore = create<CountStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

### Todo List

```typescript
interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
}

const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, { id: Date.now().toString(), text, done: false }]
  })),
  removeTodo: (id) => set((state) => ({
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    )
  })),
}));
```

### Async Actions

```typescript
interface UserStore {
  user: User | null;
  loading: boolean;
  fetchUser: (id: string) => Promise<void>;
}

const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,
  fetchUser: async (id) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/users/${id}`);
      const user = await response.json();
      set({ user, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },
}));
```

## 🤝 Contributing

This is an educational project! Feel free to:

1. Fork the repository
2. Experiment with adding new features
3. Improve the implementation
4. Add more examples

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

This project is inspired by [Zustand](https://github.com/pmndrs/zustand), created by Poimandres. The original library is production-ready and includes many more features. This clone exists purely for educational purposes.

## 🔗 Resources

- [Zustand Official Documentation](https://docs.pmnd.rs/zustand)
- [useSyncExternalStore Documentation](https://react.dev/reference/react/useSyncExternalStore)
- [React 18 External Store Guide](https://github.com/reactwg/react-18/discussions/86)
