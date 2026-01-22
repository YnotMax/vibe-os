
import { useState, useEffect } from 'react';
import { GlobalTheme, AgentStep } from '../types';

// Simple global state management for demo purposes
let listeners: Array<(state: any) => void> = [];
let state = {
  theme: 'obsidian' as GlobalTheme,
  steps: [] as AgentStep[],
  isThinking: false,
};

const setState = (newState: Partial<typeof state>) => {
  state = { ...state, ...newState };
  listeners.forEach((l) => l(state));
};

export const useVibeStore = () => {
  const [localState, setLocalState] = useState(state);

  useEffect(() => {
    const listener = (s: any) => setLocalState(s);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return {
    ...localState,
    setTheme: (theme: GlobalTheme) => setState({ theme }),
    setSteps: (steps: AgentStep[]) => setState({ steps }),
    setIsThinking: (isThinking: boolean) => setState({ isThinking }),
    updateStep: (id: string, status: AgentStep['status']) => {
      const newSteps = state.steps.map(s => s.id === id ? { ...s, status } : s);
      setState({ steps: newSteps });
    }
  };
};
